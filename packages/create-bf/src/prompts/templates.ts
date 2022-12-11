import { PromptObject } from "prompts";
import { isTemplateTrack } from "./utils";

export const templatePrompts = (): PromptObject[] => {
  return [
    {
      type: (_, { track }) => {
        if (isTemplateTrack(track)) return "select";
        return null;
      },
      name: "template",
      message: "Select a template/stack: (You can customize them later)",
      // TODO: update choices config,
      choices: [
        { title: "SSR App (Postgres, Auth, Templating)", value: "ssr" },
        { title: "Typical API (Rest, Gql, Postgres, Auth)", value: "typical" },
        {
          title: "Full Backend (API + AdminUI, Storage, Email etc...)",
          value: "backend",
        },
        { title: "Pull custom template", value: "custom" },
      ],
    },
    {
      type: (_, { template }) => {
        if (template === "custom") return "text";
        return null;
      },
      name: "templateUrl",
      message: "Enter the repository url:",
      validate: (url) =>
        /^https:\/\/[\w+.]+$/.test(url) || "Please enter a valid url",
    },
  ];
};
