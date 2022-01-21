// TODO: Implement Functionality for auth providers
/**
 * Allow Github signin/up
 * Allow google
 * Allow facebook
 * Continue with twitter etc
 */
module.exports = () => {
  const providers = [
    { name: "Google", value: "google" },
    { name: "Facebook", value: "facebook" },
    { name: "Twitter", value: "twitter" },
    { name: "Github", value: "github" },
    { name: "Email and password", value: "email-local", checked: true },
    { name: "Phone Number", value: "phone-local" },
  ];

  const prompt = {
    name: "auth-providers",
    type: "checkbox",
    message: "Select auth providers to integrate:",
    choices: [...providers],
    default: "email-local",
  };

  return prompt;
};
