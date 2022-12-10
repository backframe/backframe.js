import { PromptObject } from "prompts";
import { instructions } from "./utils";

export const featurePrompts = (): PromptObject[] => {
  return [
    {
      type: (_, { track }) => {
        if (track === "manually") return "multiselect";
        return null;
      },
      name: "apiTypes",
      message: "What type of API(s) would you like to implement?",
      choices: [
        { title: "REST", value: "rest", selected: true },
        { title: "GraphQL", value: "gql" },
      ],
      instructions,
    },
    {
      type: (_, { track }) => {
        if (track === "manually") return "select";
        return null;
      },
      name: "database",
      message: "Select a database...",
      choices: [
        { title: "Postgres", value: "postgres" },
        { title: "MongoDB", value: "mongodb" },
        { title: "MySQL", value: "mysql" },
        { title: "SQLite", value: "sqlite" },
        { title: "Redis", value: "redis" },
        { title: "None", value: "none" },
      ],
    },
    {
      type: (_, { database }) => {
        // auth needs a db to function
        if (database && database !== "none") {
          return "multiselect";
        }
        return null;
      },
      name: "authProviders",
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
    {
      type: (_, { authProviders }) => {
        if ((authProviders?.length || 0) > 0) return "select";
        return null;
      },
      name: "authStrategy",
      choices: [
        { title: "JWT based", value: "jwt" },
        { title: "Session based", value: "sessions" },
      ],
      message: "Select an auth strategy:",
    },
    {
      type: (_, { track }) => {
        if (track === "manually") return "multiselect";
        return null;
      },
      name: "additional",
      message: "Select additional server features:",
      choices: [
        { title: "Configure storage provider", value: "storageProvider" },
        { title: "Configure an email provider", value: "emailProvider" },
        { title: "Configure web sockets", value: "sockets" },
        { title: "Configure pub-sub", value: "pubsub" },
        { title: "Install admin dashboard", value: "admin" },
        { title: "Install testing utilities", value: "testing" },
      ],
      instructions,
    },
    {
      type: (_, { additional }) => {
        if (additional?.includes("emailProvider")) return "select";
        return null;
      },
      name: "emailProvider",
      message: "Select an email provider",
      choices: [
        { title: "Node mailer", value: "mailer" },
        { title: "Sendgrid", value: "sendgrid" },
        { title: "Mailchimp", value: "mailchimp" },
      ],
    },
    {
      type: (_, { additional }) => {
        if (additional?.includes("storageProvider")) return "select";
        return null;
      },
      name: "storageProvider",
      message: "Select a storage provider:",
      choices: [
        { title: "Local", value: "local" },
        { title: "Cloudinary", value: "cloudinary" },
        { title: "AWS Storage", value: "aws" },
        { title: "GCP Storage", value: "gcp" },
        { title: "Azure Storage", value: "azure" },
      ],
    },
  ];
};
