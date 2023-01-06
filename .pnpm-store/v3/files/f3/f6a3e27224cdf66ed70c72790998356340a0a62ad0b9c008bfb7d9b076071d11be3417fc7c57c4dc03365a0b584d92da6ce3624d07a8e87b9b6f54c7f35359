"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var handlePanic_exports = {};
__export(handlePanic_exports, {
  handlePanic: () => handlePanic
});
module.exports = __toCommonJS(handlePanic_exports);
var import_chalk = __toESM(require("chalk"));
var import_prompts = __toESM(require("prompts"));
var import_sendPanic = require("../sendPanic");
var import_getGithubIssueUrl = require("./getGithubIssueUrl");
var import_isCi = require("./isCi");
var import_link = require("./link");
async function handlePanic(error, cliVersion, engineVersion, command) {
  var _a;
  if ((0, import_isCi.isCi)() && Boolean((_a = import_prompts.default._injected) == null ? void 0 : _a.length) === false) {
    throw error;
  }
  await panicDialog(error, cliVersion, engineVersion, command);
}
__name(handlePanic, "handlePanic");
async function panicDialog(error, cliVersion, engineVersion, command) {
  const errorMessage = error.message.split("\n").slice(0, Math.max(20, process.stdout.rows)).join("\n");
  console.log(`${import_chalk.default.red("Oops, an unexpected error occured!")}
${import_chalk.default.red(errorMessage)}

${import_chalk.default.bold("Please help us improve Prisma by submitting an error report.")}
${import_chalk.default.bold("Error reports never contain personal or other sensitive information.")}
${import_chalk.default.dim(`Learn more: ${(0, import_link.link)("https://pris.ly/d/telemetry")}`)}
`);
  const { value: shouldSubmitReport } = await (0, import_prompts.default)({
    type: "select",
    name: "value",
    message: "Submit error report",
    initial: 0,
    choices: [
      {
        title: "Yes",
        value: true,
        description: `Send error report once`
      },
      {
        title: "No",
        value: false,
        description: `Don't send error report`
      }
    ]
  });
  if (shouldSubmitReport) {
    try {
      console.log("Submitting...");
      const reportId = await (0, import_sendPanic.sendPanic)(error, cliVersion, engineVersion);
      console.log(`
${import_chalk.default.bold(`We successfully received the error report id: ${reportId}`)}`);
      console.log(`
${import_chalk.default.bold("Thanks a lot for your help! \u{1F64F}")}`);
    } catch (error2) {
      const reportFailedMessage = `${import_chalk.default.bold.red("Oops. We could not send the error report.")}`;
      console.log(reportFailedMessage);
      console.error(`${import_chalk.default.gray("Error report submission failed due to: ")}`, error2);
    }
  }
  await (0, import_getGithubIssueUrl.wouldYouLikeToCreateANewIssue)({
    prompt: !shouldSubmitReport,
    error,
    cliVersion,
    engineVersion,
    command
  });
}
__name(panicDialog, "panicDialog");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handlePanic
});
