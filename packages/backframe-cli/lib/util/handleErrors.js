import program from "commander";
import chalk from "chalk";

module.exports = {
  enhanceErrorMessages: (methodName, log) => {
    program.Command.prototype[methodName] = function (...args) {
      if (methodName === "unknownOption" && this._allowUnknownOption) {
        return;
      } else if (methodName === "missingArgument" && args[0] === "app-name") {
        return;
      }
      this.outputHelp();
      console.log();
      console.log(`  ` + chalk.red(log(...args)));
      console.log();
      process.exit(1);
    };
  },
};
