import { PromptObject } from "prompts";
import { pacman } from "../lib/pm";
import { isManualTrack } from "./utils";

export const outroPrompts = (): PromptObject[] => {
  return [
    {
      type: "confirm",
      name: "installDeps",
      message: `Would you like to run ${pacman.name} install ?`,
      initial: true,
    },
    {
      type: (_, { track }) => {
        if (isManualTrack(track)) return "confirm";
        return null;
      },
      name: "savePreset",
      message: "Save this as a preset for later ?",
      initial: false,
    },
    {
      type: (_, { savePreset }) => {
        if (savePreset) return "text";
        return null;
      },
      name: "presetName",
      message: "What should the preset be saved as ?",
      initial: "backframe-preset",
    },
  ];
};
