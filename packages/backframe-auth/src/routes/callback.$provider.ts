import { createHandler } from "@backframe/rest";
import { TokenSet } from "openid-client";
import { getOptions, openidClient } from "../lib/oauth.js";

export const GET = createHandler({
  async action(ctx) {
    const options = getOptions(ctx);
    const { auth, db, provider, cookies } = options;
    const client = await openidClient(options);
    const params = client.callbackParams(ctx.request);

    const code_verifier = cookies.vals?.[cookies.names.codeVerifier] as string;

    let tokens: TokenSet;
    if (provider.idToken) {
      tokens = await client.callback(provider.callbackURL, params, {
        code_verifier,
      });
    } else {
      tokens = await client.oauthCallback(provider.callbackURL, params, {
        code_verifier,
      });
    }

    let userInfo;
    if (provider.userInfoRequest) {
      userInfo = await provider.userInfoRequest({ client, tokens });
    } else if (provider.idToken) {
      userInfo = tokens.claims();
    } else {
      userInfo = await client.userinfo(tokens.access_token);
    }

    const p = await provider.profile(userInfo, tokens);
    p.email = p.email?.toLowerCase();
    

    // create user then account then session
    let user = await db.authUser.findUnique({
      where: {
        email: p.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        imageURL: true,
      },
    });

    if (!user) {
      user = await db.authUser.create({
        data: {
          email: p.email,
          name: p.name,
          imageURL: p.image,
          // emailVerified: new Date(Date.now()),
        },
        select: {
          id: true,
          email: true,
          name: true,
          imageURL: true,
          emailVerified: true,
        },
      });
    }

    let account = await db.authAccount.findUnique({
      where: {
        providerID: provider.id,
      },
    });

    if (!account) {
      account = await db.authAccount.create({
        data: {
          provider: provider.type,
          providerID: provider.id,
          providerAccountID: p.id.toString(),
          refreshToken: tokens.refresh_token,
          accessToken: tokens.access_token,
          // accessTokenExpires: new Date(tokens.expires_at * 1000),
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }

    // update user accounts
    await db.authUser.update({
      where: {
        id: user.id,
      },
      data: {
        accounts: {
          // @ts-expect-error TODO: fix this
          connect: {
            id: account.id,
          },
        },
      },
    });

    const body = {
      status: "success",
      message: "User signed in successfully",
      data: {
        user,
      },
    };

    if (auth.strategy === "token-based") {
      const token = await auth.encode({ id: user.id });
      return ctx.json({
        ...body,
        token,
      });
    }

    // create session
    const session = await db.authSession.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        userID: user.id,
        accessToken: user.id,
        sessionToken: user.id,
        // expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // set cookie
    ctx.response.cookie(cookies.names.session, session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return ctx.json(body);
  },
});
