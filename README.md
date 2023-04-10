## Backframe.js - The backend framework for rapid development and deployment of APIs/Backends

_This is a WIP. Still in active development_ 

### Getting started

Here are a few things to note about backframe before getting started:

- Backframe does not support commonjs modules. Only esmodules. That means you have to use:
  ```js
  // Required in backframe
  import * from "something"
  ```
  instead of
  ```js
  // not supported
  const pkg = require("something");
  ```
- Backframe uses file-system based routing. This means you don't have to declare redundant routing patterns in your files. Simply create a new file and that automatically corresponds to a route. All routes are housed in the `src/routes` directory
- Backframe is still in active development and a lot of features may be buggy or simply not work at all

To create a new backframe app, run

```bash
npx @backframe/create-bf

# or
pnpx @backframe/create-bf

```

The CLI will prompt you for certain values and for a simple getting started example, select whether you'd like to use JS or TS then make sure to select the _CREATE MINIMAL STARTER APP_ option.
The other options have not been implemented yet
