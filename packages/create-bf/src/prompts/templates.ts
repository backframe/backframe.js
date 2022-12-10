import { PromptObject } from "prompts";

export const templatePrompts = (): PromptObject[] => {
  return [
    {
      type: (_, { track }) => {
        if (track === "templates") return "select";
        return null;
      },
      name: "template",
      message: "Select a template/stack: (You can customize them later)",
      // TODO: update choices config,
      choices: [
        { title: "Pull custom template from github", value: "github" },
        { title: "Typical API (Rest, Gql, Postgres, Auth)", value: "typical" },
        { title: "SSR App (Postgres, Auth, Templating)", value: "ssr" },
        {
          title: "Full Backend (API + AdminUI, Storage, Email etc...)",
          value: "backend",
        },
      ],
    },
    {
      type: (_, { template }) => {
        if (template === "github") return "text";
        return null;
      },
      name: "ghTemplate",
      message: "Enter repo url in @username/repo format:",
    },
  ];
};
