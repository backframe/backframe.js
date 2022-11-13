# @backframe/core

- [x] Use swc to transpile the source (used esbuild)
- [x] Load env variables if any
- [x] Load and parse the config file
- [ ] Invoke/pass along the config file to plugins
- [ ] Return a completely ready config
- [ ] Plugins contains an 'interface' to plug-in:
  - [ ] export const beforeLoad, afterLoad,

# @backframe/db

- [ ] Export model types for declaration
- [ ] Export a function for "stub" generation
- [ ] Export function for "db" generation
- [ ] Receive config from core
- [ ] Resolve addon/plugin concerned with db
- [ ] Attach db instance to config
- [ ] Return transformed config
- [ ] create orm best suited for gql, rest schemas and type safety too

<!-- t.str().maxLen(200).nullish().methods([]) -->

# @backframe/auth

- [ ] Receive config from db
- [ ] Resolve providers from config
- [ ] Resolve addon concerned with auth
- [ ] Define middleware/functionality concerned with auth
- [ ] Return transformed config with middleware ready for picking
- [ ] User scoping/ user groups

# @backframe/rest

- [ ] Receive config from auth/core
- [ ] Create default server or use one from server.ts
- [ ] Probe file system for routes
- [ ] Generate routes config
- [ ] Attach any default middleware on ones from auth
- [ ] Expose methods for starting server/actually start server
- [ ] Contain default handlers but only if method allowed
- [ ] Responses from default handlers if no db contain status, msg, details

# @backframe/cli

- [ ] Prompt for templates when getting started("Minimal") "Starter Kits", official and community
- [ ] Use cli for generation
  - [ ] bf generate resource (name, methods, general config, model)
- [ ] bf init and select type of service

# backframe-deploy

Parse config and list best alternatives

# Others

Full text search with elastic-search
Open api plugins and postman and insomnia doc-gen

# Plugins

exports.addMiddleware
exports.addAuthMiddleware
exports.expandConfig
exports.beforeLoad
exports.afterLoad
exports.addDbClient
exports.mountRoute
exports.configureStorageProvider
exports.onDeploy
exports.onRequest
exports.onResponse
exports.overrideBuilder

export default defineConfig({
// used interface is BfConfig
})

export default definePlugin({
// used interface is IBfConfigInternal
})

# @backframe/sockets

# @backframe/pubsub

Terminology:

- Resource: route + model + handlers/controllers
