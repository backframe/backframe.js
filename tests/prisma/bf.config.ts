import { PrismaAdapter } from "@backframe/adapter-prisma";
import auth from "@backframe/auth";
import africastalking from "@backframe/auth/integrations/africastalking";
import credentials from "@backframe/auth/providers/credentials";
import { createEnvValidator, defineConfig, z } from "@backframe/core";
import { PrismaClient } from "@bf/database";

const client = new PrismaClient();
const database = new PrismaAdapter(client);

export const env = createEnvValidator({
  schema: z.object({
    AFRICASTALKING_API_KEY: z.string().optional(),
    AFRICASTALKING_USERNAME: z.string().optional(),
    AFRICASTALKING_SENDER_ID: z.string().optional(),
  }),
});

export default defineConfig({
  interfaces: {
    rest: {},
  },
  database,
  plugins: [
    auth({
      mfaConfiguration: {
        status: "OFF",
        mfaTypes: ["SMS", "TOTP"],
      },
      requiredAttributes: ["firstName", "lastName", "email"],
      allowedSignInAttributes: ["phone"],
    }),
    africastalking({
      apiKey: env.AFRICASTALKING_API_KEY,
      username: env.AFRICASTALKING_USERNAME,
      senderId: env.AFRICASTALKING_SENDER_ID,
    }),
  ],
  authentication: {
    strategy: "token-based",
    providers: [credentials()],
  },
});
