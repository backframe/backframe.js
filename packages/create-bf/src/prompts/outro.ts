import { gray } from "kleur";
import { PromptObject } from "prompts";

export const outroPrompts = (): PromptObject[] => {
  return [
    {
      type: "select",
      name: "deployTarget",
      message: `Where would you like to deploy? ${gray(
        "You can change this later"
      )}`,
      choices: [
        {
          title: "backframe.app (coming soon)",
          value: "backframe",
          disabled: true,
        },
        { title: "railway.app", value: "railway" },
        { title: "fly.io", value: "fly" },
        { title: "render.com", value: "render" },
        { title: "cyclic.sh", value: "cyclic" },
      ],
    },
    {
      type: "confirm",
      name: "installDeps",
      message: `Would you like to run ${"npm"} install?`,
      initial: true,
    },
    {
      type: "confirm",
      name: "savePreset",
      message: "Save this as a preset for later?",
      initial: false,
    },
    {
      type: (_, { savePreset }) => {
        if (savePreset) return "text";
        return null;
      },
      name: "presetName",
      message: "What should the preset be saved as?",
      initial: "backframe-preset",
    },
  ];
};
