import { defineBfCommand } from "./index";

export default defineBfCommand({
  command: "add <plugin>",
  description: "Add a plugin to your backframe project",
  builder: (_) => {
    _.option("invoke", {
      alias: "i",
    });
    return _;
  },
  handler: (_) => {
    // Impl
  },
});
