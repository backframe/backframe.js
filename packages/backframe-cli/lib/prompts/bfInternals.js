// TODO: Implement manually selecting features
/**
 * Websockets
 * Metrics and Analytics
 * Clustering with PM2
 * Build with docker
 * CI/CD pipeline with GHA/Travis CI
 * docs generation!!
 */
module.exports = () => {
  const features = [
    { name: "Allow for server analytics", value: "analytics", checked: true },
    { name: "Automatic docusaurus generation", value: "docs" },
    { name: "Create a mock database for development mode", value: "mockdb" },
    { name: "Dockerize the server", value: "docker" },
    { name: "Enable web sockets connections", value: "sockets" },
    { name: "Enable clustering with PM2", value: "clustering" },
  ];

  const prompt = {
    name: "internals",
    type: "checkbox",
    message: "Manually select any additional features:",
    choices: [...features],
  };

  return prompt;
};
