import chalkAnimation from "chalk-animation";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { isMinimalTrack, isTemplateTrack } from "../prompts/utils";
import { copy, emptyDir, IConfig, rocketAscii } from "./utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function create(cfg: IConfig) {
  //  minimal app
  if (isMinimalTrack(cfg.track)) {
    await createMinimalApp(cfg);
  } else if (isTemplateTrack(cfg.track)) {
    console.log("Template track unimplemented!");
  } else {
    // handle manual
    console.log("Unimplemented");
  }
}

const sleep = (ms = 200) => new Promise((r) => setTimeout(r, ms));

async function createMinimalApp(cfg: IConfig) {
  const rainbow = chalkAnimation.rainbow(
    `${rocketAscii} Creating project files...\n`
  );

  await sleep(3000);
  const cwd = process.cwd();
  const root = path.join(cwd, cfg.targetDir);

  if (cfg.overwrite) {
    emptyDir(root);
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }

  const templateDir = path.resolve(
    __filename,
    "../../templates",
    `minimal-${cfg.languageVariant}`
  );

  const renameFiles: Record<string, string | undefined> = {
    _gitignore: ".gitignore",
  };

  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, renameFiles[file] ?? file);
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  };

  const files = fs.readdirSync(templateDir);
  for (const file of files.filter((f) => f !== "package.json")) {
    write(file);
  }

  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, "package.json"), "utf-8")
  );

  pkg.name = cfg.projectName;

  write("package.json", JSON.stringify(pkg, null, 2));

  rainbow.stop();
}
