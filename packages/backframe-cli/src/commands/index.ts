/* eslint-disable @typescript-eslint/ban-types */
import yargs from "yargs";

export const defineBfCommand = ({
  command,
  builder,
  handler,
  description,
  aliases: aliases,
}: {
  aliases?: string[];
  command: string;
  description: string;
  builder?: yargs.BuilderCallback<{}, {}> | undefined;
  handler?: // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  ((args: yargs.ArgumentsCamelCase<{}>) => void | Promise<any>) | undefined;
}) => {
  return {
    command,
    builder,
    handler,
    description,
    aliases,
  };
};
