import fs from "fs";
import { cyan } from "kleur/colors";
import { Listr } from "listr2";
import path from "path";
import { fileURLToPath } from "url";
import { isMinimalTrack, isTemplateTrack } from "../prompts/utils";
import { pacman } from "./pm";
import { copy, emptyDir, IConfig } from "./utils";

const __filename = fileURLToPath(import.meta.url);

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

// const sleep = (ms = 200) => new Promise((r) => setTimeout(r, ms));

async function createMinimalApp(cfg: IConfig) {
  const tasks = new Listr([]);

  tasks.add({
    title: "Copying project files",
    task: async () => {
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
    },
  });

  if (cfg.installDeps) {
    tasks.add({
      title: "Installing dependencies",
      task: async () => {
        // change to target dir
        process.chdir(cfg.targetDir);
        await pacman.install();
      },
    });
  }

  await tasks.run();
  // show success message
  console.log();
  console.log(cyan("Success! A new project has been created!"));
  console.log(cyan("Run the following commands to get started:"));
  process.cwd() !== cfg.targetDir && console.log(`\n$ cd \`${cfg.targetDir}\``);
  !cfg.installDeps && console.log(`\n$ ${pacman.name} install`);
  console.log(`\n$ ${pacman.name} run dev`);
}
