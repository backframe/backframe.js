import { defineBfCommand } from "../util.js";
import { serve } from "./serve.js";

export default defineBfCommand({
  aliases: ["s", "dev"],
  command: "serve",
  description: "Serve local backframe project in dev mode",
  builder: (_) => {
    _.option(
      "--ext <extensions...>",
      "Additional file extensions to to include in watcher",
      []
    )
      .option("-h --host <host>", "The host address to start the server on")
      .option("-p --port <port>", "The port to start the dev server on")
      .option(
        "-i --ignore <paths...>",
        "A list of paths to be ignored by the watcher",
        []
      )
      .option(
        "-w --watch <paths...>",
        "A list of paths to include in the watcher",
        []
      );
    return _;
  },
  action: serve,
});
