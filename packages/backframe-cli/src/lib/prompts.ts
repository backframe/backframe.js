import chalk from "chalk";
import { PromptObject } from "prompts";

const instructions = `Press ${chalk.cyan("<space>")} to select, ${chalk.cyan(
  "<enter>"
)} to proceed`;

export function getPrompts(track: "select" | "stacks") {
  if (track === "select") {
    return getFeaturePrompts();
  } else {
    return getTemplatePrompts();
  }
}

function getFeaturePrompts(): PromptObject[] {
  return [
    {
      type: "multiselect",
      name: "apiTypes",
      message: "What type of API(s) would you like to implement?",
      choices: [
        { title: "REST", value: "rest" },
        { title: "GraphQL", value: "gql" },
      ],
      instructions,
    },
    {
      name: "database",
      type: "select",
      message: "Select a database...",
      choices: [
        { title: "Postgres", value: "postgres" },
        { title: "MongoDB", value: "mongodb" },
        { title: "MySQL", value: "mysql" },
        { title: "SQLite", value: "sqlite" },
        { title: "Redis", value: "redis" },
      ],
    },
    {
      name: "authProviders",
      type: "multiselect",
      message: "Select auth providers to integrate...",
      choices: [
        { title: "Google", value: "google" },
        { title: "Twitter", value: "twitter" },
        { title: "Github", value: "github" },
        { title: "Facebook", value: "facebook" },
        { title: "Email and password", value: "emailLocal" },
        { title: "Phone Number", value: "phoneNumber" },
      ],
      instructions,
    },
  ];
}

function getTemplatePrompts(): PromptObject[] {
  return [];
}
