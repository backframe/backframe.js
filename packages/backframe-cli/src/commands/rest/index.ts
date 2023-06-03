import { defineBfCommand } from "../util";
import { routes } from "./routes";

export default defineBfCommand({
  command: "rest <subcommand>",
  description: "Manage REST API resources",
  builder(_) {
    _.command("routes")
      .description("List configured project routes")
      .action(routes);

    return _;
  },
});
