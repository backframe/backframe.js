import { Plugin } from "@backframe/core";
import at from "africastalking";

type Options = {
  to: string[];
  message: string;
};

export default function AfricasTalking(options: {
  apiKey: string;
  username: string;
  senderId: string;
}): Plugin {
  return {
    name: "africastalking",
    smsProvider(cfg) {
      const { senderId, ...atOptions } = options;
      const sms = at(atOptions).SMS;
      const opts = cfg.pluginsOptions["smsProvider"] as Options;

      ["to", "message"].forEach((key) => {
        if (!opts[key as keyof Options]) {
          throw new Error(`Missing required option \`${key}\` for smsProvider`);
        }
      });

      sms.send({
        ...opts,
        from: senderId,
      });
    },
  };
}
