import figlet from "figlet";
/* eslint-disable @typescript-eslint/ban-ts-comment */
import fs from "fs";
import gradient from "gradient-string";
import path from "path";

export const rocketAscii = "■■▶";

export interface IConfig {
  projectName: string;
  targetDir: string;
  overwrite: boolean;
  languageVariant: string;
  track: string;
  installDeps: boolean;
  apiTypes: string[];
  database: string;
  authProviders: string[];
  authStrategy: string;
  additional: string[];
  emailProvider: string;
  storageProvider: string;
  deployTarget: string;
  savePreset: boolean;
  presetName: string;
  template: string;
  templateUrl: string;
}

export function showFiglet() {
  const name = "backframe.js";

  // TODO: show additional banners, if any

  const fig = figlet.textSync(name, {
    font: "Doom",
  });

  console.log("\n", gradient.teen(fig), "\n");
}

export function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === ".git") {
      continue;
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}

export function copy(src: string, dest: string) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

export function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}
