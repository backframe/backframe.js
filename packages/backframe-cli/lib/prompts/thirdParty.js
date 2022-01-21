"use strict";
// TODO: Implement integration with third party apis
/**
 * Sendgrid
 * Twilio
 * Stripe
 * ETC.
 */
module.exports = () => {
  const prompt = {
    name: "third-party",
    type: "checkbox",
    choices: [
      {
        name: "Amazon AWS",
        value: "aws",
      },
      {
        name: "Microsoft Azure",
        value: "azure",
      },
      {
        name: "Google Cloud Platform",
        value: "gcp",
      },
      {
        name: "Firebase",
        value: "firebase",
      },
      {
        name: "Sendgrid for emails",
        value: "sendgrid",
      },
      {
        name: "Stripe for payment processing",
        value: "stripe",
      },
      {
        name: "Twilio for messaging",
        value: "twilio",
      },
    ],
    message: "Select any third party APIs/Platforms to integrate with:",
  };

  return prompt;
};
