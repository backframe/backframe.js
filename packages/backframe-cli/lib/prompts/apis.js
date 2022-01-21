// TODO:
/**
 * To include all the api options
 * 1. GraphQL
 * 2. REST
 * 3. RPC
 * 4. SOAP?
 *
 * Multiple apis are supported
 */
module.exports = () => {
  const prompt = {
    type: "checkbox",
    name: "apis",
    message: "What API(s) would you like to implement?",
    choices: [
      {
        name: "GraphQL",
        value: "gql",
      },
      { name: "REST", value: "rest", checked: true },
      { name: "RPC", value: "rpc" },
      { name: "SOAP", value: "soap" },
    ],
    default: "REST",
  };

  return prompt;
};
