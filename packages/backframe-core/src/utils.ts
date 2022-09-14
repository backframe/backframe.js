import chalk from "chalk";

export const log = {
  info: (val: string) => {
    console.log(`${chalk.cyan("[info]:")} ${val}`);
  },
  warn: (val: string) => {
    console.log(`${chalk.yellow("[warn]:")} ${val}`);
  },
  error: (val: string) => {
    console.log(`${chalk.red("[error]:")} ${val}`);
  },
  debug: (val: string) => {
    console.log(`${chalk.green("[debug]:")} ${val}`);
  },
  panic: (val: string, err?: Error) => {
    console.log(chalk.red(`[error]: ${val}`));
    if (err) {
      console.error(err);
    }
    process.exit(1);
  },
};
