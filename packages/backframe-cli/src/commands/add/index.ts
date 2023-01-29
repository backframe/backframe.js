import { defineBfCommand } from "../util";
import { add } from "./add";

export default defineBfCommand({
  command: "add <plugin...>",
  description: "Add a plugin to your backframe project",
  builder: (_) => {
    _.option("-s, --skip-install", "Skip installing the plugin");
    return _;
  },
  action: add,
});
