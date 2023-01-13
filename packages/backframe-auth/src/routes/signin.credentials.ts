import { createHandler, defineRouteConfig, z } from "@backframe/rest";
import { InvalidCredentials, UserNotFound } from "../lib/errors.js";
import { getOptions } from "../lib/oauth.js";

export const config = defineRouteConfig({
  enabledMethods: [], // set empty to disable default handlers
});

export const GET = createHandler({
  action(ctx) {
    return ctx.json(
      {
        statusCode: 400,
        message: "Method not allowed",
        description: "The `GET` method is not allowed on this resource",
      },
      405
    );
  },
});

export const POST = createHandler({
  input: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(64),
  }),
  async action(ctx) {
    const { auth, bf, db } = getOptions(ctx);
    const { email, password } = ctx.input;

    // find user
    const user = await db.authUser.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        imageURL: true,
        password: true,
      },
    });

    if (!user) {
      return ctx.json(UserNotFound(), 400);
    }

    // compare password
    const valid = await auth.compare(password, user.password);
    if (!valid) {
      return ctx.json(InvalidCredentials(), 400);
    }

    // if found and token, generate jwt and send
    const { password: _, ...usr } = user;
    const { strategy } = bf.getConfig("authentication");
    const body = {
      status: "success",
      message: "User signed in successfully",
      data: {
        user: usr,
      },
    };

    if (strategy === "token-based") {
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

    ctx.response.cookie("bf-auth-session", session.id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 60 * 24,
    });

    return ctx.json(body);
  },
});
