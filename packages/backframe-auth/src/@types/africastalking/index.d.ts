/// <reference types="node" />

declare module "africastalking" {
  interface AfricasTalkingOptions {
    apiKey: string;
    username: string;
  }

  interface SMSOptions {
    to: string[];
    message: string;
    from: string;
    enqueue?: boolean;
  }

  class SMS {
    constructor(options: AfricasTalkingOptions);

    send(opts: SMSOptions | Array<SMSOptions>): Promise<void>;
  }

  export class AfricasTalking {
    constructor(options: AfricasTalkingOptions);

    SMS: SMS;
  }

  export default function AfricasTalking(
    options: AfricasTalkingOptions
  ): AfricasTalking;
}
