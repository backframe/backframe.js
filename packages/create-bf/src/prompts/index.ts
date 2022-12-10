import type { PromptObject } from "prompts";
import { configPrompts } from "./config";
import { featurePrompts } from "./features";
import { outroPrompts } from "./outro";
import { templatePrompts } from "./templates";
import { IPromptFnArgs } from "./utils";

export function resolvePrompts(config: IPromptFnArgs) {
  const questions: PromptObject[] = [];
  [configPrompts, templatePrompts, featurePrompts, outroPrompts].forEach(
    (p) => {
      p(config).forEach((_) => questions.push(_));
    }
  );
  return questions;
}
