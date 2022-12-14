import { z } from "zod";
import { BfConfig } from "./index.js";

type Plugin = (cfg: BfConfig) => void;

export const BfPluginSchema = z.object({
  // name: z.string().optional(),
  // description: z.string().optional(),
  // version: z.string().optional(),
  modifyServer: z.custom<Plugin>().optional(),
  storageProvider: z.custom<Plugin>().optional(),
  emailProvider: z.custom<Plugin>().optional(),
});

export type BfPluginConfig = z.input<typeof BfPluginSchema>;
