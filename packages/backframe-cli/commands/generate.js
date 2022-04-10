import chalk from "chalk";
import fs from "fs";
import inquirer from "inquirer";
import path from "path";
import {promisify} from "util";

import {RestGenerator, toTitleCase} from "@backframe/shared-utils";
import {version} from "os";

const access = promisify(fs.access);

export async function generate(api, options) {
  const ctx = process.cwd();

  try {
    await access(path.join(ctx, "backframe.json"), fs.constants.R_OK);
  } catch (error) {
    console.log(
      chalk.red(
        `\nFatal: could not detect a ${chalk.yellow(
          `backframe.json`,
        )} file in current directory. Are you in a backframe project?\n`,
      ),
    );
    return;
  }

  switch (api) {
    case "rest":
      generateRest(ctx);
      break;
    case "gql":
      console.log("gql");
      break;
    case "rpc":
      console.log("rpc");
      break;
    case "soap":
      console.log("soap");
      break;
    default:
      break;
  }
}

async function generateRest(ctx) {
  let introPrompt = [
    {
      name: "resource",
      type: "input",
      message:
        "What is the name of the new resource?(Use singular value words)",
    },
    {
      name: "versioning",
      type: "confirm",
      message: "Would you like to setup versioning?",
    },
    {
      name: "version",
      type: "number",
      message: "Enter version number (Integers only)",
      when: answers => answers.versioning,
    },
  ];

  const {resource, version} = await inquirer.prompt(introPrompt);

  let methodPrompt = {
    name: "methodArray",
    type: "checkbox",
    message: "What methods would you like to implement on the resource?",
    choices: [
      {
        name: "GET",
        value: "get",
      },
      {
        name: "POST",
        value: "post",
      },
      {
        name: "PUT",
        value: "put",
      },
      {
        name: "DELETE",
        value: "delete",
      },
    ],
  };

  let methods = {};
  const {methodArray} = await inquirer.prompt(methodPrompt);

  // FIXME: This is some very repetitive and ugly code 🤮.
  // The prompts worked incorrectly everytime i tried wrapping this in a forEach loop
  // Fix me if you can 😃
  if (methodArray.includes("get")) {
    let options = parseOptions("get", resource);
    let res = await inquirer.prompt(options);
    methods["get"] = {
      ...res,
      allowedFields: res.allowedFields.split(","),
      subResources: res.subResources.split(","),
    };
  }

  if (methodArray.includes("post")) {
    let options = parseOptions("post", resource);
    let res = await inquirer.prompt(options);
    methods["push"] = {
      ...res,
      allowedFields: res.allowedFields.split(","),
      subResources: res.subResources.split(","),
    };
  }

  if (methodArray.includes("put")) {
    let options = parseOptions("put", resource);
    let res = await inquirer.prompt(options);
    methods["put"] = {
      ...res,
      allowedFields: res.allowedFields.split(","),
      subResources: res.subResources.split(","),
    };
  }

  if (methodArray.includes("delete")) {
    let options = parseOptions("delete", resource);
    let res = await inquirer.prompt(options);
    methods["delete"] = {
      ...res,
      allowedFields: res.allowedFields.split(","),
      subResources: res.subResources.split(","),
    };
  }

  const config = {
    methods,
    version,
  };

  // Start actual generation, subResources: res.subResources.split(",")
  let gen = new RestGenerator(resource, ctx, config);
  console.log(chalk.green(`🤖 Generating the resource....`));
  gen.generateResource();
  console.log();
  console.log(chalk.blue(`✔ Successfully generated the new resource....`));
}

function parseOptions(m, resource) {
  let methodData = [];

  const info = `${chalk.green(`[${m.toUpperCase()} OPTION:]`)}`;
  m === "get" &&
    methodData.push({
      name: "getAll",
      type: "confirm",
      message: `${info} Generate a method to get all values for the resource?`,
    });

  methodData.push(
    {
      name: "allowedFields",
      type: "input",
      message: `${info} Enter any allowed subfields for the resource (Comma separated): `,
    },
    {
      name: "subResources",
      type: "input",
      message: `${info} Enter any additional sub-resources (Comma separated):`,
    },
    {
      name: "protected",
      type: "confirm",
      message: `Require authentication for the ${chalk.yellow(
        m.toUpperCase(),
      )} method on the ${chalk.green(toTitleCase(resource))} resource?`,
    },
  );

  return methodData;
}
