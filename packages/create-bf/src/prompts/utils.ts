import { cyan, gray } from "kleur/colors";

export const MANUAL_TRACK = "manually";
export const TEMPLATE_TRACK = "templates";
export const MINIMIST_TRACK = "minimal";

export const isManualTrack = (t: string) => {
  return t === MANUAL_TRACK;
};

export const isTemplateTrack = (t: string) => {
  return t === TEMPLATE_TRACK;
};

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
