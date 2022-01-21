exports.getPromptModules = () => {
  return [
    "apis",
    "database",
    "authProviders",
    "bfInternals",
    "thirdParty",
    "outroPrompts",
  ].map((file) => require(`../prompts/${file}`));
};
