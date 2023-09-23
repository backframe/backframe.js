/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BfUser,
  BfUserSession,
  BfVerificationToken,
  PublicBfUserSchema,
} from "@backframe/core";
import { createHandler, z } from "@backframe/rest";
import * as speakeasy from "speakeasy";
import { UserNotFound } from "../../lib/errors.js";
import { getOptions } from "../../lib/oauth.js";

export const POST = createHandler({
  input: z.object({
    token: z.string(),
    userId: z.string(),
    sessionId: z.string().optional(),
    channel: z.enum(["SMS", "EMAIL", "TOTP"]),
  }),
  async action(ctx) {
    const { token: userToken, userId, channel, sessionId } = ctx.input;
    const { db, auth } = getOptions(ctx);
    const user = (await db.read("user", {
      where: {
        id: userId,
      },
    })) as BfUser;

    if (!user) {
      return ctx.json(UserNotFound(), 400);
    }

    let newUserData: Partial<BfUser> = {
      status: "ENABLED",
      twoFactorEnabled: true,
    };

    if (channel === "TOTP") {
      const userMeta = user.unsafeMetadata;
      const base32secret = userMeta.temporaryTwoFactorSecret as string;

      const verified = speakeasy.totp.verify({
        secret: base32secret,
        encoding: "base32",
        token: userToken,
      });

      if (!verified) {
        return ctx.json(
          {
            status: "error",
            code: "auth/invalid-token",
            message: "Invalid token",
          },
          400
        );
      }

      newUserData = {
        ...newUserData,
        unsafeMetadata: {
          ...userMeta,
          temporaryTwoFactorSecret: undefined,
          twoFactorSecret: base32secret,
          preferredTwoFactorMethod: "TOTP",
        },
      };
    } else {
      if (!sessionId) {
        return ctx.json(
          {
            status: "error",
            code: "auth/invalid-session",
            message: "Invalid session",
          },
          400
        );
      }

      const challenge = await db.read<BfVerificationToken, BfVerificationToken>(
        "verificationToken",
        {
          where: { id: sessionId },
        }
      );

      if (!challenge) {
        return ctx.json(
          {
            status: "error",
            code: "auth/invalid-session",
            message: "Invalid session",
          },
          400
        );
      }

      const validToken = () => {
        return (
          challenge.token === userToken && challenge.expiresAt > new Date()
        );
      };

      if (!validToken()) {
        return ctx.json(
          {
            status: "error",
            code: "auth/invalid-token",
            message: "Invalid verification token",
          },
          400
        );
      }

      await db.delete("verificationToken", {
        where: { id: challenge.id },
      });

      if (channel === "SMS") {
        newUserData = {
          ...newUserData,
          phoneVerified: new Date(),
          unsafeMetadata: {
            ...user.unsafeMetadata,
            preferredTwoFactorMethod: "SMS",
          },
        };
      } else if (channel === "EMAIL") {
        newUserData = {
          ...newUserData,
          emailVerified: new Date(),
          unsafeMetadata: {
            ...user.unsafeMetadata,
            preferredTwoFactorMethod: "EMAIL",
          },
        };
      }
    }

    // no further action required
    await db.update<BfUser>("user", {
      where: { id: userId },
      data: newUserData,
    });

    const meta = await db.read<BfUser, BfUser>("user", {
      where: { id: user.id },
    });

    // filter out unsafe metadata
    const result = PublicBfUserSchema.safeParse(meta);
    if (result.success === false) {
      throw new Error(
        `Couldn't parse public user metadata: ${
          result.error.flatten().fieldErrors
        }`
      );
    }

    const body = {
      status: "success",
      message: "User signed in successfully",
      data: {
        user: result.data,
      },
    };

    if (auth.strategy === "token-based") {
      const token = await auth.encode({ id: user.id }); // TODO: add claims
      return ctx.json({
        ...body,
        token,
      });
    } else {
      const session: any = await db.create<BfUserSession>("userSession", {
        ip: ctx.request.ip,
        userId: user.id,
        userAgent: ctx.request.headers["user-agent"],
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      });

      ctx.response.cookie("bfauthapp", session.id, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 60 * 24,
      });

      return ctx.json(body);
    }
  },
});
