# TypeScript Checkpoint Client ![npm](https://img.shields.io/npm/v/checkpoint-client)

A TypeScript Checkpoint client for a [Checkpoint Server](https://github.com/prisma/checkpoint.prisma.io). Checkpoint provides version information and security alerts for your products.

```ts
import checkpoint from 'checkpoint-client'

checkpoint.check({
  product: 'prisma',
  version: '2.0.0',
})
```

## Features

- No impact on the developer experience of your CLI
- Easily hook into any product
- Bring your own styles

## Install

```sh
npm install checkpoint-client
```

## API

### `checkpoint.check(input: Input): Promise<Result>`

Check for the latest version and inform the user of any security notices.

```ts
await checkpoint.check({
  product: 'prisma',
  version: '2.0.0',
})
```

#### `Input`

|              Field |     Attributes      | Description                                                               |
| -----------------: | :-----------------: | :------------------------------------------------------------------------ |
|          `product` | _string, required_  | Name of the product. Current we only support `prisma`.                    |
|          `version` | _string, required_  | Currently installed version of the product (e.g. `1.0.0-rc0`)             |
|    `cli_path_hash` | _string, required_  | A unique hash of the path in which the CLI is installed                   |
|     `project_hash` | _string, required_  | A unique hash of the project's path, i.e.. the `schema.prisma`'s path     |
|          `disable` | _boolean, required_ | Disable checking for an update if it's not already cached. Useful for CI. |
|         `endpoint` | _string, optional_  | Checkpoint server endpoint URL. Defaults to https://checkpoint.prisma.io. |
|          `timeout` | _number, optional_  | Time in milliseconds we should wait for a response before giving up.      |
|             `arch` | _string, optional_  | Client's operating system architecture (e.g. `amd64`).                    |
|               `os` | _string, optional_  | Client's operating system (e.g. `darwin`).                                |
|     `node_version` | _string, optional_  | Client's node version (e.g. `v12.12.0`).                                  |
|        `signature` | _string, optional_  | Random, non-identifiable signature to ensure alerts aren't repeated.      |
|       `cache_file` | _string, optional_  | File where we store the response for the `cache_duration`.                |
|   `cache_duration` | _number, optional_  | Time in milliseconds to store the response. Defaults to 12 hours.         |
|  `remind_duration` | _number, optional_  | Time in milliseconds to wait for a new reminder. Defaults to 48 hours.    |
|            `force` | _boolean, optional_ | Force a check regardless of `disable` or `CHECKPOINT_DISABLE`.            |
|            `unref` | _boolean, optional_ | Control when we should unreference the child. Use with care.              |
| `cli_install_type` | _string, optional_  | 'local' or 'global'                                                       |

#### `Result`

The result's shape changes depending on the `status`:

##### `status: "ok"` and `status: "reminded"`

The `ok` status occurs when we our cached result is available and valid.

```ts
type Result = {
  status: 'ok'
  data: Output
}
```

The `reminded` status occurs when we recently checked the cache. This status is influenced by the `remind_duration`.

```ts
type Result = {
  status: 'reminded'
  data: Output
}
```

In both cases, the `Output` has the following shape:

|                   Field |     Attributes      | Description                                      |
| ----------------------: | :-----------------: | :----------------------------------------------- |
|               `product` | _string, required_  | Product we're checking on.                       |
|       `current_version` | _string, required_  | Latest version of the product.                   |
|  `current_release_date` | _number, required_  | Release date of the latest version in Unix time. |
|  `current_download_url` | _string, required_  | URL to download the latest version.              |
| `current_changelog_url` | _string, required_  | URL to the latest version's changelog.           |
|       `project_website` | _string, required_  | Website for the project.                         |
|              `outdated` | _boolean, required_ | True if the our version is outdated.             |
|              `alerts[]` | _Alert[], required_ | New security alerts or notices for this version. |
|                   `.id` | _string, required_  | ID of the alert.                                 |
|                 `.date` | _string, required_  | Date of the alert in Unix time.                  |
|              `.message` | _string, required_  | Alert message.                                   |
|                  `.url` | _string, optional_  | URL for more information about the alert.        |
|                `.level` | _string, required_  | Severity of the alert.                           |

##### `status: "waiting"`

The `waiting` status occurs when we don't have the cached result and we're requesting it from the checkpoint server.

```ts
type Result = {
  status: 'waiting'
  data: ChildProcess
}
```

If you like, you can pass `unref: false` as input and wait for the `ChildProcess` to exit. The child process prints out the `Output` to stdout. You can see an example in [check-version](./examples/check-version.ts).

##### `status: "disabled"`

The `disabled` status occurs when we've explicitly disabled this service. The most common case for this is in CI.

```ts
type Result = {
  status: 'disabled'
}
```

You can see an example for this in [is-ci](./examples/is-ci.ts).

#### Environment variables

|                Field |     Attributes     | Description                                    |
| -------------------: | :----------------: | :--------------------------------------------- |
| `CHECKPOINT_DISABLE` | _string, optional_ | Disable the checkpoint client                  |
| `CHECKPOINT_TIMEOUT` | _string, optional_ | Globally set timeout for our checkpoint client |

## Clearing the Cache

```
// macOS
ls ~/Library/Caches/checkpoint-nodejs
rm -rf ~/Library/Caches/checkpoint-nodejs

// Windows
C:\Users\Jan\AppData\Local\checkpoint-nodejs

// Linux
$XDG_CACHE_HOME/checkpoint-nodejs
Or
$HOME - /home/.cache/checkpoint-nodejs
```

## Examples

You can use `ts-node` to run the examples:

```ts
npm install
npm run build
node dist/examples/is-ci.js
```

- [update-notifier example](./examples/update-notifier.ts)
- [Wait for version example](./examples/check-version.ts)
- [CI example](./examples/is-ci.ts)

## Publishing a new Version

1. Pull latest changes from GitHub
2. Bump the package version
3. Update the `History.md`. We recommend [git-changelog](https://github.com/tj/git-extras/blob/master/Commands.md#git-changelog). Run `git changelog --tag 1.1.XX`
4. Run `npm publish`
5. Run `git commit -am "Release <version>"`
6. Run `git tag <version>`
7. Run `git push --tags origin main`

> You can automate steps 5-7 with [git-release](https://github.com/tj/git-extras/blob/master/Commands.md#git-release).

## About Us

The [Prisma Team](https://prisma.io) is behind the Checkpoint Client – [chat with us on Slack](https://slack.prisma.io/)!
