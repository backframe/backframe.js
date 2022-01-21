const { generateEnv } = require("../lib/generateEnv");

const opt = {
  envs: [
    { key: "FOUR", value: "FIVE" },
    { key: "KEY", value: "Value" },
    { key: "KEY", value: "Value" },
    { key: "KEY", value: "Value" },
    { key: "KEY", value: "Value" },
    { key: "KEY", value: "Value" },
  ],
};

generateEnv(opt);
