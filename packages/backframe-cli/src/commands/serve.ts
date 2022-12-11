import { defineBfCommand } from "./index";

export default defineBfCommand({
  command: "serve",
  description: "Serve local backframe project",
  builder: (_) => {
    _.option("port", {
      alias: "p",
      default: 6969,
      description: "The port to start the server on",
    })
      .option("watch", {
        alias: "w",
        boolean: true,
        description: "Start the server in watch mode",
      })
      .option("open", {
        alias: "o",
        boolean: true,
      });
  },
  handler: (args) => {
    console.log(args);
  },
});
