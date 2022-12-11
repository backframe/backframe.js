import { defineBfCommand } from "./index";

export default defineBfCommand({
  command: "generate",
  description: "Use the cli to scaffold new resources",
  builder: (_) => {
    _.option("route", {
      requiresArg: true,
      description: "Create a new route",
    }).option("model", {
      requiresArg: true,
      description: "Create a new db model",
    });
  },
});
