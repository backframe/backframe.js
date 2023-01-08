import type { DB } from "@backframe/models";
import { createHandler, z } from "@backframe/rest";
import { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = createHandler({
  input: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(64),
  }),
  async action(ctx) {
    const db = ctx.db as DB;
    const bf = ctx.config;
    const { email, password } = ctx.input;

    // find user
    const user = await db.authUser.findUnique({
      where: { email },
    });

    if (!user) {
      return ctx.json(
        {
          status: "error",
          code: "auth/user-not-found",
          message: "User not found",
        },
        400
      );
    }

    // compare password
    const valid = compareSync(password, user.password);
    if (!valid) {
      return ctx.json(
        {
          status: "error",
          code: "auth/invalid-credentials",
          message: "Invalid Login credentials",
        },
        400
      );
    }

    // if found and token, generate jwt and send
    const { strategy } = bf.getConfig("authentication");
    const body = {
      status: "success",
      message: "User signed in successfully",
      data: {
        user: { id: user.id, email: user.email },
      },
    };

    if (strategy === "token-based") {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return ctx.json({
        ...body,
        token,
      });
    }

    // found and session, create cookie and session
    const session = await db.authSession.create({
      data: {
        user,
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
