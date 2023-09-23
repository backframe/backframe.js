import { z } from "zod";

export const BfAuthPolicySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  actions: z.array(z.string()),
  resources: z.array(z.string()),
  conditions: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export const BfUserRoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  permissions: z.array(BfAuthPolicySchema),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export const BfUserSchema = z.object({
  id: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  imageURL: z.string().optional(),
  roles: z.array(BfUserRoleSchema),
  username: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  status: z.enum(["ENABLED", "DISABLED", "PENDING", "BANNED", "DELETED"]),
  twoFactorEnabled: z.boolean(),
  unsafeMetadata: z.custom<Record<string, unknown>>(),
  emailVerified: z.date().optional(),
  phoneVerified: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const PublicBfUserSchema = z.object({
  id: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  imageURL: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  createdAt: z.date(),
});

export const BfUserSessionSchema = z.object({
  id: z.string(),
  ip: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  lastUsedAt: z.date(),
  expiresAt: z.date(),
  userAgent: z.string(),
  sessionToken: z.string().optional(),
});

export const BfUserTokenSchema = z.object({
  id: z.string(),
  userId: z.string(),
  token: z.string(),
  permissions: z.array(BfAuthPolicySchema),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export const BfOrganizationMemberSchema = z.object({
  id: z.string(),
  userId: z.string(),
  organizationId: z.string(),
  roles: z.array(BfUserRoleSchema),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export const BfOrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  imageURL: z.string().optional(),
  logoURL: z.string().optional(),
  members: z.array(BfOrganizationMemberSchema),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export const BfVerificationTokenSchema = z.object({
  id: z.string(),
  identifier: z.string(),
  token: z.string(),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export type BfAuthPolicy = z.infer<typeof BfAuthPolicySchema>;
export type BfUserRole = z.infer<typeof BfUserRoleSchema>;
export type BfUser = z.infer<typeof BfUserSchema>;
export type PublicBfUser = z.infer<typeof PublicBfUserSchema>;
export type BfUserSession = z.infer<typeof BfUserSessionSchema>;
export type BfUserToken = z.infer<typeof BfUserTokenSchema>;
export type BfOrganizationMember = z.infer<typeof BfOrganizationMemberSchema>;
export type BfOrganization = z.infer<typeof BfOrganizationSchema>;
export type BfVerificationToken = z.infer<typeof BfVerificationTokenSchema>;
