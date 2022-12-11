import { defineBfCommand } from "./index";

export default defineBfCommand({
  command: "rest",
  description: "A command to manage REST api functionality",
  builder: (_) => {
    _.command(
      "routes",
      "List configured project routes",
      (_) => {},
      (h) => {
        console.log(h);
      }
    ).command(
      "generate <resource>",
      "Generate a new resource",
      (_) => {
        _.option("skip-model", {
          boolean: true,
        }).option("skip-tests", {
          boolean: true,
          default: true,
        });
      },
      (h) => {
        console.log(h);
      }
    );
  },
});
