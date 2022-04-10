import chalk from "chalk";

module.exports = (type, pkgName, options) => {
  switch (type) {
    case "plugin":
      {
        console.log(
          `${chalk.green.bold(
            `💉 Injecting ${chalk.cyan(pkgName)} into the server....`
          )}`
        );
      }
      break;
    case "middleware":
      {
        console.log(
          `${chalk.green.bold(
            `➕ Adding new middleware: ${chalk.cyan(pkgName)} to the server....`
          )}`
        );
      }
      break;
    default:
      {
        // this.outputHelp();
        console.log();
        console.log(
          `${chalk.red.bold(
            `You have passed an invalid option ${chalk.yellow(
              `<${type}>`
            )} to the add command`
          )}`
        );
        console.log();
        console.log(
          `${chalk.white(
            `Allowed options are ${chalk.yellow(`<plugin>`)} or ${chalk.yellow(
              `<middleware>`
            )}`
          )}\n`
        );
      }
      break;
  }
};
