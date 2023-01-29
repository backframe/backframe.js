#!/usr/bin/env node

/**
 * Use this file to start your server in production
 * Otherwise, you can simply use the `bf serve` cmd
 */

import loadConfig from "@backframe/core";
import { startServer } from "@backframe/rest/serve";

startServer(await loadConfig());
