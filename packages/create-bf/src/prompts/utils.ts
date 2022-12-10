import { cyan, gray } from "kleur";

export interface IPromptFnArgs {
  argTargetDir: string | undefined;
  targetDir: string;
  defaultCfg: IPromptsConfig;
}

export interface IPromptsConfig {
  projectName: string;
  languageVariant: string;
}

export const instructions = gray(
  `Press ${cyan("<space>")} to select, ${cyan("<enter>")} to proceed`
);
