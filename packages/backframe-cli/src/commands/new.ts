import { main as create } from "create-bf";
import { defineBfCommand } from "./index";

export default defineBfCommand({
  command: "new [project]",
  description: "Create a new backframe app",
  builder: (b) => {
    b.describe({
      new: "Create a new backframe app",
    })
      .option("default", {
        alias: "d",
        description: "Skip prompts and use default values",
      })
      .option("git", {
        alias: "g",
        boolean: true,
        default: true,
        description: "Initialize the project with git",
      })
      .option("force", {
        alias: "f",
        boolean: true,
        description: "Overwrite target dir if exists",
      })
      .option("typescript", {
        alias: "ts",
        boolean: true,
        description: "Initialize project with typescript",
      });
    return b;
  },
  handler: (args) => {
    args._ = args._.filter((i) => i !== "new");

    // @ts-ignore
    create(args);
  },
});
