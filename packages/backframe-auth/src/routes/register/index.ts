/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BfUser,
  BfUserSession,
  BfVerificationToken,
  PublicBfUserSchema,
} from "@backframe/core";
import { createHandler, defineRouteConfig, z } from "@backframe/rest";
import { logger } from "@backframe/utils";
import * as qrcode from "qrcode";
import * as speakeasy from "speakeasy";
import {
  AccountExists,
  MissingRequiredAttribute,
  PasswordsDontMatch,
} from "../../lib/errors.js";
import { getOptions } from "../../lib/oauth.js";
import { generateVerificationCode } from "../../lib/utils.js";

export const config = defineRouteConfig({
  enabledMethods: [],
});

export const POST = createHandler({
  query: z.object({
    attr: z.enum(["email", "phone", "username"]).default("email"),
  }),
  input: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    username: z.string().optional(),
    imageURL: z.string().url().optional(),
    password: z.string().min(8).max(64),
    passwordConfirm: z.string().min(8).max(64).optional(),
  }),
  async action(ctx) {
    const { db, auth, getSMSTemplate } = getOptions(ctx);
    const { attr } = ctx.query;

    const {
      email,
      password,
      passwordConfirm,
      imageURL,
      firstName,
      lastName,
      username,
      phone,
    } = ctx.input;

    const mfa = auth.mfaConfiguration ?? { status: "OFF" };
    const userparamKey = attr;
    const userparamValue = ctx.input[userparamKey];

    // check allowed sign in attributes
    if (!auth.allowedSignInAttributes?.includes(attr)) {
      return ctx.json(
        {
          status: "error",
          code: "auth/invalid-attribute",
          message: `Sign in with ${attr} is not allowed`,
        },
        400
      );
    }

    if (!userparamValue) {
      return ctx.json(MissingRequiredAttribute(userparamValue), 400);
    }

    for (const attr of auth.requiredAttributes ?? []) {
      if (!ctx.input[attr as keyof typeof ctx.input]) {
        logger.dev(`Missing required attribute: ${attr}`);
        return ctx.json(MissingRequiredAttribute(attr), 400);
      }
    }

    if (["ON", "OPTIONAL"].includes(mfa?.status)) {
      if (!ctx.input["email"] && mfa?.mfaTypes?.includes("EMAIL")) {
        return ctx.json(MissingRequiredAttribute("email"), 400);
      }
      if (!ctx.input["phone"] && mfa?.mfaTypes?.includes("SMS")) {
        return ctx.json(MissingRequiredAttribute("phone"), 400);
      }
    }

    if (passwordConfirm && password !== passwordConfirm) {
      return ctx.json(PasswordsDontMatch(), 400);
    }

    let user = await db.read<BfUser, BfUser>("user", {
      where: { [userparamKey]: userparamValue },
    });

    if (user) {
      logger.dev("User already exists");
      return ctx.json(AccountExists(userparamKey), 400);
    }

    const hash = await auth.hash(password);
    user = await db.create<BfUser>("user", {
      email,
      phone,
      firstName,
      lastName,
      username,
      imageURL,
      status: "DISABLED",
      unsafeMetadata: {
        passwordHash: hash,
      },
    });

    if (mfa.status === "ON") {
      const preferredMfa = mfa.mfaTypes?.[0] ?? "TOTP";

      switch (preferredMfa) {
        case "TOTP": {
          const secretCode = speakeasy.generateSecret({
            name: `${auth.appName ?? "Backframe app"}:${userparamValue}`,
          });

          await db.update<BfUser>("user", {
            where: { id: user.id },
            data: {
              unsafeMetadata: {
                ...user.unsafeMetadata,
                temporaryTwoFactorSecret: secretCode.base32,
              },
            },
          });

          const dataURL = await qrcode.toDataURL(secretCode.otpauth_url);

          return ctx.json({
            status: "TOTP_VERIFICATION_REQUIRED",
            message: "Scan QR code to setup 2FA",
            data: {
              identifier: user.id,
              qrCode: dataURL,
            },
          });
        }
        case "SMS": {
          // create, store and send verification challenge
          const challenge = generateVerificationCode(6);
          const token = await db.create<
            BfVerificationToken,
            BfVerificationToken
          >("verificationToken", {
            identifier: user.id,
            token: challenge,
            expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
          });

          // TODO: load message template from settings
          ctx.config.pluginsOptions["smsProvider"] = {
            ...ctx.config.pluginsOptions["smsProvider"],
            to: [user.phone],
            message: getSMSTemplate("verificationCode", {
              otp_code: challenge,
              app_name: auth.appName ?? "Backframe app",
              age: 5,
            }),
          };

          ctx.config.$invokePlugin("smsProvider");

          return ctx.json({
            status: "SMS_VERIFICATION_REQUIRED",
            message: "Verification code sent to phone",
            data: {
              identifier: user.id,
              sessionId: token.id,
              recipient: user.phone,
            },
          });
        }
        case "EMAIL": {
          throw new Error("EMAIL not implemented");
        }
      }
    } else {
      // no further action required
      const meta = await db.update<BfUser>("user", {
        where: { id: user.id },
        data: { status: "ENABLED" },
      });

      // filter out unsafe metadata
      const result = PublicBfUserSchema.safeParse(meta);
      if (result.success === false) {
        console.error(result.error.flatten().fieldErrors);
        throw new Error("Couldn't parse public user metadata");
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
    }
  },
});
