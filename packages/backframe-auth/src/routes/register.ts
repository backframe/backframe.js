import { createHandler, defineRouteConfig, z } from "@backframe/rest";
import { logger } from "@backframe/utils";
import { AccountExists, PasswordsDontMatch } from "../lib/errors.js";
import { getOptions } from "../lib/oauth.js";

export const config = defineRouteConfig({
  enabledMethods: [],
});

export const POST = createHandler({
  // TODO: created custom error map
  input: z.object({
    name: z.string().optional(),
    email: z.string().email(),
    imageURL: z.string().url().optional(),
    password: z.string().min(8).max(64),
    passwordConfirm: z.string().min(8).max(64).optional(),
  }),
  async action(ctx) {
    const { email, password, passwordConfirm, imageURL, name } = ctx.input;
    if (passwordConfirm && password !== passwordConfirm) {
      return ctx.json(PasswordsDontMatch(), 400);
    }

    const { db, auth } = getOptions(ctx);
    let user = await db.authUser.findUnique({
      where: { email },
    });

    if (user) {
      logger.dev("User already exists");
      return ctx.json(AccountExists(), 400);
    }

    const hash = await auth.hash(password);
    user = await db.authUser.create({
      data: {
        name,
        email,
        imageURL,
        password: hash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        imageURL: true,
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

    // found and session, create cookie and session
    const session = await db.authSession.create({
      data: {
        user: {
          connect: { id: user.id },
        },
        userID: user.id,
        accessToken: user.id,
        sessionToken: user.id,
      },
    });

    ctx.response.cookie("bfauthapp", session.id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 60 * 24,
    });

    return ctx.json(body);
  },
});
