#!/usr/bin/env node

import("../dist/index.mjs").then((m) => (m.default || m).main());
