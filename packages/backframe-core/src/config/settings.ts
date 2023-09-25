import { z } from "zod";
import { BfAuthPolicySchema, BfUserSchema } from "../adapters/types.js";

export const BfEmailTemplateSchema = z.object({
  name: z.string(),
  from: z.string(),
  subject: z.string(),
  body: z.string(),
});

export const BfSettingsSchema = z.object({
  auth: z
    .object({
      applicationName: z.string().default("Backframe"),
      routePrefix: z.string().default("/auth"),
      requiredAttributes: z
        .array(BfUserSchema.keyof())
        .optional()
        .default(["email", "phone", "firstName", "lastName"]),
      allowedSignInAttributes: z
        .array(z.enum(["phone", "email", "username"]))
        .optional()
        .default(["phone", "email", "username"]),
      smsTemplates: z
        .object({
          verificationCode: z
            .string()
            .optional()
            .default(
              "{{otp_code}} is your {{app_name}} verification code and it will expire in {{age}} minutes. Do not share this with anyone."
            ),
          passwordChanged: z
            .string()
            .optional()
            .default(
              "Your {{app_name}} password has been changed! If you did not make this change, please reach out to an administrator for support."
            ),
          invitation: z
            .string()
            .optional()
            .default(
              "{{inviter_name}} has invited you to join them on {{app_name}} {{action_url}}"
            ),
          resetPassword: z
            .string()
            .optional()
            .default(
              "{{inviter_name}} has invited you to join them on {{app_name}} {{action_url}}"
            ),
        })
        .default({}),
      emailTemplates: z
        .object({
          verificationCode: BfEmailTemplateSchema.optional(),
          resetPassword: BfEmailTemplateSchema.optional(),
          invitation: BfEmailTemplateSchema.optional(),
          passwordChanged: BfEmailTemplateSchema.optional(),
          organizationInvitation: BfEmailTemplateSchema.optional(),
          magicLinkSignIn: BfEmailTemplateSchema.optional(),
          magicLinkSignUp: BfEmailTemplateSchema.optional(),
          magicLinkVerifyEmail: BfEmailTemplateSchema.optional(),
        })
        .default({}),
      mfaConfiguration: z
        .object({
          codeLength: z.number().default(6),
          codeExpiresIn: z.number().default(10),
          status: z.enum(["ON", "OFF", "OPTIONAL"]).default("OFF"),
          mfaTypes: z
            .array(z.enum(["SMS", "EMAIL", "TOTP"]))
            .default(["TOTP", "EMAIL", "SMS"]),
        })
        .default({}),
      userRolesConfiguration: z
        .object({
          default: z.string().optional().default("USER"),
          roles: z
            .array(
              z.object({
                name: z.string(),
                permissions: z.array(BfAuthPolicySchema),
              })
            )
            .default([
              {
                name: "USER",
                permissions: [
                  {
                    id: "sid-allow",
                    effect: "ALLOW",
                    actions: ["*"],
                    resources: ["hello"],
                    name: "allow-uses",
                  },
                ],
              },
              {
                name: "ADMIN",
                permissions: [],
              },
            ]),
        })
        .default({}),
      policies: z.array(BfAuthPolicySchema).default([]),
    })
    .default({}),
});

export type BfSettings = z.infer<typeof BfSettingsSchema>;
