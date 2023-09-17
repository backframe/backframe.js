import { main as create } from "create-bf";
import { defineBfCommand } from "../util";

export default defineBfCommand({
  command: "new <project>",
  description: "Create a new backframe project",
  builder: (_) => {
    _.option("-ts --typescript", "Initialize project with typescript")
      .option("-g --git", "Initialize the project with git")
      .option("-f --force", "Overwrite target dir if exists")
      .option("-d --default", "Skip prompts and use default values");

    return _;
  },
  action: create,
});
