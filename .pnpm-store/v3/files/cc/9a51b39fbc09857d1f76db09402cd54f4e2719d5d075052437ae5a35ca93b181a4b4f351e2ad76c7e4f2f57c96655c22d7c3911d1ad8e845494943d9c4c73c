'use strict';

var assert = require('assert');
var ci = require('ci-info');
var concatStream = require('concat-stream');
var http = require('http');
var os = require('os');
var path = require('path');
var tempfile = require('tempfile');
var testaway = require('testaway');
var url = require('url');
var uuid = require('uuid');
var writeFileFn = require('fast-write-atomic');
var makeDir = require('make-dir');
var util = require('util');
var fs = require('fs');
var child_process = require('child_process');
var paths = require('env-paths');
var ms = require('ms');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var assert__default = /*#__PURE__*/_interopDefaultLegacy(assert);
var ci__default = /*#__PURE__*/_interopDefaultLegacy(ci);
var concatStream__default = /*#__PURE__*/_interopDefaultLegacy(concatStream);
var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var os__default = /*#__PURE__*/_interopDefaultLegacy(os);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var tempfile__default = /*#__PURE__*/_interopDefaultLegacy(tempfile);
var testaway__default = /*#__PURE__*/_interopDefaultLegacy(testaway);
var url__default = /*#__PURE__*/_interopDefaultLegacy(url);
var writeFileFn__default = /*#__PURE__*/_interopDefaultLegacy(writeFileFn);
var makeDir__default = /*#__PURE__*/_interopDefaultLegacy(makeDir);
var util__default = /*#__PURE__*/_interopDefaultLegacy(util);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var paths__default = /*#__PURE__*/_interopDefaultLegacy(paths);
var ms__default = /*#__PURE__*/_interopDefaultLegacy(ms);

// imports

// promisify
const writeFile = util__default["default"].promisify(writeFileFn__default["default"]);
const readFile = util__default["default"].promisify(fs__default["default"].readFile);
const unlink = util__default["default"].promisify(fs__default["default"].unlink);

// U is the subset of T, not sure why
// this works or why _T is necessary










// valid default schema
const defaultSchema = {
  last_reminder: 0,
  cached_at: 0,
  version: '',
  cli_path: '',
  // User output
  output: {
    client_event_id: '',
    previous_client_event_id: '',
    product: '',
    cli_path_hash: '',
    local_timestamp: '',
    previous_version: '',
    current_version: '',
    current_release_date: 0,
    current_download_url: '',
    current_changelog_url: '',
    package: '',
    release_tag: '',
    install_command: '',
    project_website: '',
    outdated: false,
    alerts: [],
  },
};

// initialize the configuration
class Config {
  static async new(state, schema = defaultSchema) {
    await makeDir__default["default"](path__default["default"].dirname(state.cache_file));
    return new Config(state, schema)
  }

  constructor(  state,   defaultSchema) {this.state = state;this.defaultSchema = defaultSchema;}

  // check and return the cache if (matches version or hasn't expired)
  async checkCache(newState) {
    const now = newState.now();
    // fetch the data from the cache
    const cache = await this.all();

    if (!cache) {
      return { cache: undefined, stale: true }
    }
    // version has been upgraded or changed
    // TODO: define this behaviour more clearly.
    if (newState.version !== cache.version) {
      return { cache, stale: true }
    }
    // cache expired
    if (now - cache.cached_at > newState.cache_duration) {
      return { cache, stale: true }
    }
    return { cache, stale: false }
  }

  // set the configuration
  async set(update) {
    const existing = (await this.all()) || {};
    const schema = Object.assign(existing, update);
    // TODO: figure out how to type this
    for (let k in this.defaultSchema) {
      // @ts-ignore
      if (typeof schema[k] === 'undefined') {
        // @ts-ignore
        schema[k] = this.defaultSchema[k];
      }
    }
    await writeFile(this.state.cache_file, JSON.stringify(schema, null, '  '));
  }

  // get the entire schema
  async all() {
    try {
      const data = await readFile(this.state.cache_file, 'utf8');
      return JSON.parse(data)
    } catch (err) {
      return
    }
  }

  // get a value from the schema
  async get(key) {
    const schema = await this.all();
    if (typeof schema === 'undefined') {
      return
    }
    return schema[key]
  }

  // reset the configuration
  async reset() {
    await writeFile(this.state.cache_file, JSON.stringify(this.defaultSchema, null, '  '));
    return
  }

  // delete the configuration, ignoring any errors
  async delete() {
    try {
      await unlink(this.state.cache_file);
      return
    } catch (err) {
      return
    }
  }
}

// JS-Checkpoint is a API-compatible JS client for a checkpoint server, like https://checkpoint.hashicorp.com/.

// Child path of the binary
// eval("__dirname") to make ncc happy
const childPath = path__default["default"].join(eval('__dirname'), 'child');

// Check types






































































































































































// actual implementation of the check() function
async function check(input) {
  // Create a cache file for this instance of the CLI path
  const defaultCache = getCacheFile(input.product, input.cli_path_hash || 'default');
  const ci = require('ci-info'); 

  // initialize the internal state
  const state = {
    product: input.product,
    version: input.version,
    cli_install_type: input.cli_install_type || '',
    information: input.information || '',
    local_timestamp: input.local_timestamp || rfc3339(new Date()),
    project_hash: input.project_hash,
    cli_path: input.cli_path || '',
    cli_path_hash: input.cli_path_hash || '',
    endpoint: input.endpoint || 'https://checkpoint.prisma.io',
    disable: typeof input.disable === 'undefined' ? false : input.disable,
    arch: input.arch || os__default["default"].arch(),
    os: input.os || os__default["default"].platform(),
    node_version: input.node_version || process.version,
    ci: typeof input.ci !== 'undefined' ? input.ci : ci.isCI,
    ci_name: typeof input.ci_name !== 'undefined' ? input.ci_name || '' : ci.name || '',
    command: input.command || '',
    schema_providers: input.schema_providers || [],
    schema_preview_features: input.schema_preview_features || [],
    schema_generators_providers: input.schema_generators_providers || [],
    cache_file: input.cache_file || defaultCache,
    cache_duration: typeof input.cache_duration === 'undefined' ? ms__default["default"]('12h') : input.cache_duration,
    remind_duration: typeof input.remind_duration === 'undefined' ? ms__default["default"]('48h') : input.remind_duration,
    force: typeof input.force === 'undefined' ? false : input.force,
    timeout: getTimeout(input.timeout),
    unref: typeof input.unref === 'undefined' ? true : input.unref,
    child_path: input.child_path || childPath,
    now: () => Date.now(),
    client_event_id: input.client_event_id || '',
    previous_client_event_id: input.previous_client_event_id || '',
    check_if_update_available: false,
  };

  // the CHECKPOINT_DISABLE environment variable will disable checkpoint from
  // checking for a new version or for alerts
  if ((process.env['CHECKPOINT_DISABLE'] || state.disable) && !state.force) {
    return {
      status: 'disabled',
    }
  }

  // make the cache file without if we haven't already
  const config = await Config.new(state);
  // check if we've already cached the response
  const cacheResponse = await config.checkCache(state);

  // if the cache is stale (can be expired, or uses a different version):
  // send an additional `check_if_update_needed` field to the telemetry service to get a new response for versions
  state.check_if_update_available = cacheResponse.stale === true || !cacheResponse.cache;

  // Spawn the child to send telemetry request
  const child = spawn(state);

  if (state.unref) {
    child.unref();
    // Closes the IPC channel between parent and child
    child.disconnect();
  }

  // If the cache is stale or does not exist, wait for it to be invalidated
  if (cacheResponse.stale === true || !cacheResponse.cache) {
    return {
      status: 'waiting',
      data: child,
    }
  }

  // instead of resetting the whole cache, only update where `state` has non-nullish values
  for (const key of Object.keys(state)) {
    if (state[key]) {
      await config.set({
        [key]: state[key],
      });
    }
  }

  // lastly, check if we've recently informed the user
  const userReminded = state.now() - cacheResponse.cache.last_reminder < state.remind_duration;

  if (userReminded) {
    // User has been reminded. Don't inform them right now
    return {
      status: 'reminded',
      data: cacheResponse.cache.output,
    }
  }

  // otherwise update the last_reminder and return the cache
  await config.set({
    last_reminder: state.now(),
  });

  return {
    status: 'ok',
    data: cacheResponse.cache.output,
  }
}

/**
 *
 * @param product The name of the product, e.g. 'prisma'
 * @param cacheIdentifier Identifier to differentiate different cache files for a product
 */
function getCacheFile(product, cacheIdentifier) {
  const dirs = paths__default["default"](`checkpoint`); // Get a user local storage path
  return path__default["default"].join(dirs.cache, `${product}-${cacheIdentifier}`)
}

// get the timeout from the input or environment variable
function getTimeout(inputTimeout) {
  if (typeof inputTimeout !== 'undefined') {
    return inputTimeout
  }
  // the CHECKPOINT_TIMEOUT for compatibility with go-checkpoint
  const timeoutString = process.env['CHECKPOINT_TIMEOUT'];
  if (typeof timeoutString === 'undefined') {
    return 5000
  }
  const timeout = parseInt(timeoutString, 10);
  if (isNaN(timeout)) {
    return 5000
  }
  return timeout
}

function getForkOpts(state) {
  if (state.unref === true) {
    return {
      detached: true,
      // When CHECKPOINT_DEBUG_STDOUT !== undefined, use 'inherit' to let the child print the debug output
      stdio: process.env.CHECKPOINT_DEBUG_STDOUT ? 'inherit' : 'ignore',
      env: process.env,
    }
  }

  return { detached: false, stdio: 'pipe', env: process.env }
}

// spawn a child
function spawn(state) {
  return child_process.fork(childPath, [JSON.stringify(state)], getForkOpts(state))
}

// Returns an rfc3339 compliant local date string with timezone.
// This function is unfortunately necessary because Date.toISOString() always returns the time in UTC.
// This function return an RFC3339 formatted string in the user's local time zone.
function rfc3339(d) {
  function pad(n) {
    return n < 10 ? '0' + n : n
  }

  function timezoneOffset(offset) {
    let sign;
    if (offset === 0) {
      return 'Z'
    }
    sign = offset > 0 ? '-' : '+';
    offset = Math.abs(offset);
    return sign + pad(Math.floor(offset / 60)) + ':' + pad(offset % 60)
  }

  return (
    d.getFullYear() +
    '-' +
    pad(d.getMonth() + 1) +
    '-' +
    pad(d.getDate()) +
    'T' +
    pad(d.getHours()) +
    ':' +
    pad(d.getMinutes()) +
    ':' +
    pad(d.getSeconds()) +
    timezoneOffset(d.getTimezoneOffset())
  )
}

// Imports

// Check tests
describe('check', () => {
  const projects = ['project1', 'project2'];
  const localCliPathHash = 'b2b2b2b2';

  describe('simple', function () {
    let server;
    let calls = 0;

    const product = 'test';
    const cache_file = tempfile__default["default"]();
    const response = {
      product: product,
      cli_path_hash: localCliPathHash,
      current_version: '0.0.2',
      current_release_date: 1577712063907,
      current_download_url: 'https://dl.prisma.io/downloads/0.0.2.tar.gz',
      current_changelog_url: 'https://dl.prisma.io/downloads/0.0.2',
      project_website: `https://${product}.prisma.io`,
      install_command: 'npm install --save-dev prisma',
      local_timestamp: '2020-08-04T12:57:16+07:00',
      outdated: true,
      alerts: [],
    };

    beforeAll(async () => {
      server = await serve((req, res) => {
        calls++;
        assert__default["default"].strictEqual(req.headers['accept'], 'application/json');
        assert__default["default"].strictEqual(req.headers['user-agent'], 'prisma/js-checkpoint');
        if (!req.url) throw new Error('unknown request url')
        const u = url__default["default"].parse(req.url, true);
        const product = (u.pathname || '').split('/').slice(-1)[0];
        assert__default["default"].strictEqual(product, 'test');
        const version = u.query['version'];
        assert__default["default"].ok(/0\.0\.[12]/.test(version), `version doesn't match 0.0.1 or 0.0.2`);
        assert__default["default"].strictEqual(u.query['node_version'], process.version);
        assert__default["default"].strictEqual(u.query['os'], os__default["default"].platform());
        assert__default["default"].strictEqual(u.query['arch'], os__default["default"].arch());
        // This is a bit silly, but since we run these tests in CI,
        // sometimes they're true, but locally they're not. This
        // is handling both cases in different environments.
        if (ci__default["default"].isCI) {
          assert__default["default"].strictEqual(u.query['ci'], 'true');
        } else {
          assert__default["default"].strictEqual(u.query['ci'], 'false');
        }
        assert__default["default"].strictEqual((u.query['signature'] || '').length, 36);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
      });
    });

    afterAll(async () => {
      await server.close();
    });

    // careful, these tests depend on each other
    it('should go to mock server', async () => {
      // test going to the server
      let result = await check({
        cli_install_type: 'global',
        cache_file: cache_file,
        cli_path: 'a/b/c',
        cli_path_hash: localCliPathHash,
        project_hash: projects[0],
        endpoint: server.url,
        local_timestamp: '2020-08-04T12:57:16+07:00',
        product: product,
        version: '0.0.1',
        unref: false,
      });
      assert__default["default"].strictEqual(result.status, 'waiting');
      if (result.status !== 'waiting') throw new Error('not ok')
      const { stdout } = await wait(result.data);
      assert__default["default"].deepStrictEqual(JSON.parse(stdout), {
        product: 'test',
        cli_path_hash: localCliPathHash,
        current_version: '0.0.2',
        current_release_date: 1577712063907,
        current_download_url: 'https://dl.prisma.io/downloads/0.0.2.tar.gz',
        current_changelog_url: 'https://dl.prisma.io/downloads/0.0.2',
        install_command: 'npm install --save-dev prisma',
        project_website: 'https://test.prisma.io',
        outdated: true,
        local_timestamp: '2020-08-04T12:57:16+07:00',
        alerts: [],
      } );
      assert__default["default"].strictEqual(calls, 1);
    });

    it('should use cache', async () => {
      // test going to the server
      let result = await check({
        cli_install_type: 'global',
        cache_file: cache_file,
        cli_path: 'a/b/c',
        cli_path_hash: localCliPathHash,
        project_hash: projects[0],
        endpoint: server.url,
        product: product,
        version: '0.0.1',
      });
      await waitMs(500);
      assert__default["default"].strictEqual(result.status, 'ok');
      if (result.status !== 'ok') throw new Error('not ok')
      assert__default["default"].deepStrictEqual(result.data, {
        product: 'test',
        cli_path_hash: localCliPathHash,
        current_version: '0.0.2',
        current_release_date: 1577712063907,
        current_download_url: 'https://dl.prisma.io/downloads/0.0.2.tar.gz',
        current_changelog_url: 'https://dl.prisma.io/downloads/0.0.2',
        install_command: 'npm install --save-dev prisma',
        project_website: 'https://test.prisma.io',
        outdated: true,
        local_timestamp: '2020-08-04T12:57:16+07:00',
        alerts: [],
      } );

      assert__default["default"].strictEqual(calls, 2);
    });

    it('should ignore cache if new version', async () => {
      // test going to the server
      let result = await check({
        cli_install_type: 'global',
        cache_file: cache_file,
        cli_path: 'a/b/c',
        cli_path_hash: localCliPathHash,
        endpoint: server.url,
        project_hash: projects[0],
        product: product,
        version: '0.0.2',
        unref: false,
      });
      assert__default["default"].strictEqual(result.status, 'waiting');
      if (result.status !== 'waiting') throw new Error('not ok')
      const { stdout } = await wait(result.data);
      assert__default["default"].deepStrictEqual(JSON.parse(stdout), {
        product: 'test',
        cli_path_hash: localCliPathHash,
        current_version: '0.0.2',
        current_release_date: 1577712063907,
        current_download_url: 'https://dl.prisma.io/downloads/0.0.2.tar.gz',
        current_changelog_url: 'https://dl.prisma.io/downloads/0.0.2',
        install_command: 'npm install --save-dev prisma',
        project_website: 'https://test.prisma.io',
        local_timestamp: '2020-08-04T12:57:16+07:00',
        outdated: true,
        alerts: [],
      } );
      assert__default["default"].strictEqual(calls, 3);
    });

    it('should use cache for 0.0.2', async () => {
      // test going to the server
      let result = await check({
        cli_install_type: 'global',
        cache_file: cache_file,
        cli_path: 'a/b/c',
        cli_path_hash: localCliPathHash,
        project_hash: projects[0],
        endpoint: server.url,
        product: product,
        version: '0.0.2',
      });
      await waitMs(500);
      assert__default["default"].strictEqual(result.status, 'ok');
      if (result.status !== 'ok') throw new Error('not ok')
      assert__default["default"].deepStrictEqual(result.data, {
        product: 'test',
        cli_path_hash: localCliPathHash,
        current_version: '0.0.2',
        current_release_date: 1577712063907,
        current_download_url: 'https://dl.prisma.io/downloads/0.0.2.tar.gz',
        current_changelog_url: 'https://dl.prisma.io/downloads/0.0.2',
        install_command: 'npm install --save-dev prisma',
        project_website: 'https://test.prisma.io',
        local_timestamp: '2020-08-04T12:57:16+07:00',
        outdated: true,
        alerts: [],
      } );
      assert__default["default"].strictEqual(calls, 4);
    });

    it('should return reminded if recently reminded', async () => {
      // test going to the server
      let result = await check({
        cli_install_type: 'global',
        cache_file: cache_file,
        cli_path: 'a/b/c',
        cli_path_hash: localCliPathHash,
        endpoint: server.url,
        product: product,
        project_hash: projects[0],
        version: '0.0.2',
      });
      await waitMs(500);
      assert__default["default"].strictEqual(result.status, 'reminded');
      if (result.status !== 'reminded') {
        throw new Error(`expected status to be reminded, got: ${result.status}`)
      }
      assert__default["default"].deepStrictEqual(result.data, {
        product: 'test',
        cli_path_hash: localCliPathHash,
        current_version: '0.0.2',
        current_release_date: 1577712063907,
        current_download_url: 'https://dl.prisma.io/downloads/0.0.2.tar.gz',
        current_changelog_url: 'https://dl.prisma.io/downloads/0.0.2',
        install_command: 'npm install --save-dev prisma',
        project_website: 'https://test.prisma.io',
        local_timestamp: '2020-08-04T12:57:16+07:00',
        outdated: true,
        alerts: [],
      } );
      assert__default["default"].strictEqual(calls, 5);
    });
  });

  describe('track previous_client_event_id', function () {
    let server;
    let calls = 0;

    const product = 'test';
    const cache_file = tempfile__default["default"]();
    const response = {
      product: product,
      cli_path_hash: localCliPathHash,
      current_version: '0.0.2',
      current_release_date: 1577712063907,
      current_download_url: 'https://dl.prisma.io/downloads/0.0.2.tar.gz',
      current_changelog_url: 'https://dl.prisma.io/downloads/0.0.2',
      project_website: `https://${product}.prisma.io`,
      install_command: 'npm install --save-dev prisma',
      local_timestamp: '2020-08-04T12:57:16+07:00',
      outdated: true,
      alerts: [],
    };

    beforeAll(async () => {
      server = await serve((req, res) => {
        calls++;
        assert__default["default"].strictEqual(product, 'test');
        if (!req.url) throw new Error('unknown request url')
        const u = url__default["default"].parse(req.url, true);

        res.setHeader('Content-Type', 'application/json');
        const merge = {
          client_event_id: u.query['client_event_id'],
          previous_client_event_id: u.query['previous_client_event_id'],
        };
        res.end(JSON.stringify(Object.assign({}, response, merge)));
      });
    });

    afterAll(async () => {
      await server.close();
    });

    // careful, these tests depend on each other
    it('should go to mock server', async () => {
      // test going to the server
      let result = await check({
        client_event_id: 'test-1',
        cli_install_type: 'global',
        cache_file: cache_file,
        cli_path: 'a/b/c',
        cli_path_hash: localCliPathHash,
        project_hash: projects[0],
        endpoint: server.url,
        local_timestamp: '2020-08-04T12:57:16+07:00',
        product: product,
        version: '0.0.1',
        unref: false,
      });
      assert__default["default"].strictEqual(result.status, 'waiting');
      if (result.status !== 'waiting') throw new Error('not ok')
      const { stdout } = await wait(result.data);
      const out = JSON.parse(stdout); 
      // TODO: why is there a log here?
      // console.log('1 out previous_client_event_id', out.previous_client_event_id)
      assert__default["default"].deepStrictEqual(out.previous_client_event_id, '');
      assert__default["default"].deepStrictEqual(out, {
        client_event_id: 'test-1',
        previous_client_event_id: '',
        product: 'test',
        cli_path_hash: localCliPathHash,
        current_version: '0.0.2',
        current_release_date: 1577712063907,
        current_download_url: 'https://dl.prisma.io/downloads/0.0.2.tar.gz',
        current_changelog_url: 'https://dl.prisma.io/downloads/0.0.2',
        install_command: 'npm install --save-dev prisma',
        project_website: 'https://test.prisma.io',
        outdated: true,
        local_timestamp: '2020-08-04T12:57:16+07:00',
        alerts: [],
      } );
      assert__default["default"].strictEqual(calls, 1);
    });

    it('should use cache', async () => {
      // test going to the server
      let result = await check({
        client_event_id: 'test-cache-x',
        cli_install_type: 'global',
        cache_file: cache_file,
        cli_path: 'a/b/c',
        cli_path_hash: localCliPathHash,
        project_hash: projects[0],
        endpoint: server.url,
        product: product,
        version: '0.0.1',
      });
      await waitMs(500);
      assert__default["default"].strictEqual(result.status, 'ok');
      if (result.status !== 'ok') throw new Error('not ok')
      assert__default["default"].deepStrictEqual(result.data, {
        // same ids because cache was used
        client_event_id: 'test-1',
        previous_client_event_id: '',
        product: 'test',
        cli_path_hash: localCliPathHash,
        current_version: '0.0.2',
        current_release_date: 1577712063907,
        current_download_url: 'https://dl.prisma.io/downloads/0.0.2.tar.gz',
        current_changelog_url: 'https://dl.prisma.io/downloads/0.0.2',
        install_command: 'npm install --save-dev prisma',
        project_website: 'https://test.prisma.io',
        outdated: true,
        local_timestamp: '2020-08-04T12:57:16+07:00',
        alerts: [],
      } );
      assert__default["default"].strictEqual(calls, 2);
    });

    it('should ignore cache if new version', async () => {
      // test going to the server
      let result = await check({
        client_event_id: 'test-2',
        cli_install_type: 'global',
        cache_file: cache_file,
        cli_path: 'a/b/c',
        cli_path_hash: localCliPathHash,
        endpoint: server.url,
        project_hash: projects[0],
        product: product,
        version: '0.0.2',
        unref: false,
      });
      assert__default["default"].strictEqual(result.status, 'waiting');
      if (result.status !== 'waiting') throw new Error('not ok')
      const { stdout } = await wait(result.data);
      const out = JSON.parse(stdout); 
      assert__default["default"].deepStrictEqual(out, {
        // new client_event_id is now set because an event was sent, so previous_client_event_id is set to the old value
        client_event_id: 'test-2',
        previous_client_event_id: 'test-1',
        product: 'test',
        cli_path_hash: localCliPathHash,
        current_version: '0.0.2',
        current_release_date: 1577712063907,
        current_download_url: 'https://dl.prisma.io/downloads/0.0.2.tar.gz',
        current_changelog_url: 'https://dl.prisma.io/downloads/0.0.2',
        install_command: 'npm install --save-dev prisma',
        project_website: 'https://test.prisma.io',
        local_timestamp: '2020-08-04T12:57:16+07:00',
        outdated: true,
        alerts: [],
      } );
      assert__default["default"].strictEqual(calls, 3);
    });

    it('should use cache again', async () => {
      // test going to the server
      let result = await check({
        client_event_id: 'test-cache-2',
        cli_install_type: 'global',
        cache_file: cache_file,
        cli_path: 'a/b/c',
        cli_path_hash: localCliPathHash,
        project_hash: projects[0],
        endpoint: server.url,
        product: product,
        version: '0.0.2',
      });
      await waitMs(500);
      assert__default["default"].strictEqual(result.status, 'ok');
      if (result.status !== 'ok') throw new Error('not ok')
      assert__default["default"].deepStrictEqual(result.data, {
        // same ids again because that was a cached response
        client_event_id: 'test-2',
        previous_client_event_id: 'test-1',
        product: 'test',
        cli_path_hash: localCliPathHash,
        current_version: '0.0.2',
        current_release_date: 1577712063907,
        current_download_url: 'https://dl.prisma.io/downloads/0.0.2.tar.gz',
        current_changelog_url: 'https://dl.prisma.io/downloads/0.0.2',
        install_command: 'npm install --save-dev prisma',
        project_website: 'https://test.prisma.io',
        outdated: true,
        local_timestamp: '2020-08-04T12:57:16+07:00',
        alerts: [],
      } );
      assert__default["default"].strictEqual(calls, 4);
    });
  });

  describe('slow server', () => {
    let server;
    let calls = 0;

    beforeAll(async () => {
      server = await serve(() => {
        calls++;
        // slow server
      });
    });

    afterAll(async () => {
      await server.close();
    });

    it(
      'should timeout',
      async () => {
        const cache_file = tempfile__default["default"]();
        let result = await check({
          cli_install_type: 'global',
          cache_file: cache_file,
          cli_path: 'a/b/c',
          cli_path_hash: localCliPathHash,
          endpoint: server.url,
          product: 'prisma',
          project_hash: projects[0],
          version: '0.0.1',
          unref: false,
        });
        if (result.status !== 'waiting') {
          throw new Error('expected status to be waiting')
        }
        const { code, stdout, stderr } = await wait(result.data);
        assert__default["default"].strictEqual(code, 1);
        assert__default["default"].strictEqual(stdout, '');
        assert__default["default"].ok(~stderr.indexOf('checkpoint-client: process timed out after 5s'), 'expected stderr to timeout');
        assert__default["default"].strictEqual(calls, 1);
      },
      12 * 1000,
    );
  });

  describe('disable', () => {
    let server;
    let calls = 0;

    beforeAll(async () => {
      server = await serve(() => {
        calls++;
        // slow server
      });
    });

    afterAll(async () => {
      await server.close();
    });

    it('test', async () => {
      const cache_file = tempfile__default["default"]();
      let result = await check({
        cli_install_type: 'global',
        disable: true,
        cli_path_hash: localCliPathHash,
        cache_file: cache_file,
        cli_path: 'a/b/c',
        endpoint: server.url,
        product: 'prisma',
        project_hash: projects[0],
        version: '0.0.1',
      });
      assert__default["default"].strictEqual(calls, 0);
      assert__default["default"].strictEqual(result.status, 'disabled');
    });
  });

  describe('others', () => {
    it.skip('should work with our production endpoint and wait for result', async () => {
      let result = await check({
        cli_install_type: 'global',
        cache_duration: 0,
        cli_path: 'a/b/c',
        product: 'prisma',
        cli_path_hash: localCliPathHash,
        project_hash: projects[0],
        version: '0.0.1',
        unref: false,
      });
      if (result.status !== 'waiting') {
        throw new Error('expected status to be waiting')
      }
      const { code, stdout, stderr } = await wait(result.data);
      assert__default["default"].strictEqual(code, 0);
      assert__default["default"].strictEqual(stderr, '');
      // check the child
      const output = JSON.parse(stdout);
      assert__default["default"].ok(!!~output.current_version.indexOf('2.0.0-'));
      assert__default["default"].deepStrictEqual('prisma', output.product);
      assert__default["default"].ok(!!~output.install_command, 'npm install prisma@');
      assert__default["default"].deepStrictEqual('https://github.com/prisma/@prisma/cli', output.current_download_url);
      // assert.deepStrictEqual(1576158940, output.current_release_date)
      assert__default["default"].deepStrictEqual('https://github.com/prisma/@prisma/cli', output.current_changelog_url);
      assert__default["default"].deepStrictEqual(true, output.outdated);
      assert__default["default"].deepStrictEqual('https://prisma.io', output.project_website);
      assert__default["default"].deepStrictEqual([], output.alerts);
      // check the result again, expecting a cached version
      result = await check({
        cli_install_type: 'global',
        product: 'prisma',
        cli_path: 'a/b/c',
        cli_path_hash: localCliPathHash,
        project_hash: projects[0],
        version: '0.0.1',
      });
      await waitMs(500);
      if (result.status !== 'ok') {
        throw new Error('expected status to be ok')
      }
      assert__default["default"].ok(!!~result.data.current_version.indexOf('2.0.0-'));
      assert__default["default"].deepStrictEqual('prisma', result.data.product);
      assert__default["default"].deepStrictEqual('https://github.com/prisma/@prisma/cli', result.data.current_download_url);
      assert__default["default"].ok(!!~output.install_command, 'npm install prisma@');
      // assert.deepStrictEqual(1576158940, output.current_release_date)
      assert__default["default"].deepStrictEqual('https://github.com/prisma/@prisma/cli', result.data.current_changelog_url);
      assert__default["default"].deepStrictEqual(true, result.data.outdated);
      assert__default["default"].deepStrictEqual('https://prisma.io', result.data.project_website);
      assert__default["default"].deepStrictEqual([], result.data.alerts);
    });

    it.skip('should work with our production endpoint and finish immediately', async () => {
      const res = await check({
        cli_install_type: 'global',
        cache_duration: 0,
        cli_path_hash: localCliPathHash,
        cli_path: 'a/b/c',
        product: 'prisma',
        project_hash: projects[0],
        version: '0.0.1',
      });

      assert__default["default"].strictEqual(res.status, 'waiting');
    });

    it('test bad server', async () => {
      const result = await check({
        cli_install_type: 'global',
        cache_duration: 0,
        endpoint: 'https://zargol.prisma.io',
        cli_path_hash: localCliPathHash,
        cli_path: 'a/b/c',
        product: 'prisma',
        project_hash: projects[0],
        version: '0.0.1',
        unref: false,
      });
      if (result.status !== 'waiting') {
        throw new Error('expected status to be waiting')
      }
      const { code, stdout, stderr } = await wait(result.data);
      assert__default["default"].strictEqual(code, 1);
      assert__default["default"].strictEqual(stdout, '');
      assert__default["default"].ok(~stderr.indexOf('FetchError'), 'expected stderr to contain FetchError');
    });

    it(
      'checkpoint should be import-able',
      async function () {
        const tmpdir = path__default["default"].join(os__default["default"].tmpdir(), 'checkpoint-client-' + uuid.v4());
        await testaway__default["default"](tmpdir, path__default["default"].join(__dirname, '..'));
        const checkpoint = await (function (t) { return Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require(t)); }); })(path__default["default"].join(tmpdir, 'node_modules', 'checkpoint-client'));
        assert__default["default"].strictEqual(typeof checkpoint.check, 'function');
      },
      60 * 1000,
    );
  });

  describe('per-command telemetry', () => {
    let server;
    let calls = 0;
    let queryParams = {};
    const cache_file = tempfile__default["default"]();

    beforeAll(async () => {
      server = await serve((req, res) => {
        calls++;
        if (!req.url) throw new Error('unknown request url')

        const u = url__default["default"].parse(req.url, true);
        queryParams = u.query;

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({}));
      });
    });

    afterAll(async () => {
      await server.close();
    });

    it('should send `check_if_update_available` when there is no cache', async () => {
      const res = await check({
        product: 'prisma',
        endpoint: server.url,
        project_hash: localCliPathHash,
        version: '0.0.1',
        cache_file,
        unref: false,
      });

      if (res.status !== 'waiting') {
        throw new Error(`status should be waiting, but got: ${res.status}`)
      }

      await wait(res.data);

      assert__default["default"].strictEqual(res.status, 'waiting');
      assert__default["default"].strictEqual(queryParams['check_if_update_available'], 'true');
      assert__default["default"].strictEqual(calls, 1);
    });

    it('should not send `check_if_update_available` when the cache is not stale', async () => {
      const res = await check({
        product: 'prisma',
        endpoint: server.url,
        project_hash: localCliPathHash,
        version: '0.0.1',
        cache_file,
        unref: false,
      });

      await waitMs(500);
      assert__default["default"].strictEqual(res.status, 'ok');
      assert__default["default"].strictEqual(queryParams['check_if_update_available'], 'false');
      assert__default["default"].strictEqual(calls, 2);
    });

    it('should send `check_if_update_available` when the cache is stale', async () => {
      const res = await check({
        product: 'prisma',
        endpoint: server.url,
        project_hash: localCliPathHash,
        version: '0.0.1',
        cache_file,
        cache_duration: 100,
        unref: false,
      });

      if (res.status !== 'waiting') {
        throw new Error(`status should be waiting, but got: ${res.status}`)
      }

      await wait(res.data);

      assert__default["default"].strictEqual(res.status, 'waiting');
      assert__default["default"].strictEqual(queryParams['check_if_update_available'], 'true');
      assert__default["default"].strictEqual(calls, 3);
    });
  });

  describe('debug', () => {
    let server;
    let calls = 0;
    const cache_file = tempfile__default["default"]();

    beforeAll(async () => {
      server = await serve((req, res) => {
        calls++;
        if (!req.url) throw new Error('unknown request url')

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({}));
      });
    });

    afterAll(async () => {
      await server.close();
    });

    it('should not send telemetry record when CHECKPOINT_DEBUG_STDOUT is here', async () => {
      process.env.CHECKPOINT_DEBUG_STDOUT = 'true';

      const result = await check({
        cli_install_type: 'global',
        cache_file: cache_file,
        cli_path: 'a/b/c',
        cli_path_hash: localCliPathHash,
        endpoint: server.url,
        product: 'prisma',
        project_hash: projects[0],
        version: '0.0.1',
        unref: false,
      });

      if (result.status !== 'waiting') {
        throw new Error('expected status to be waiting')
      }

      const { code, stdout, stderr } = await wait(result.data);

      expect(code).toEqual(0);
      expect(calls).toEqual(0);
      expect(stdout.includes('[checkpoint-client] debug')).toEqual(true);
      expect(stderr).toEqual('');

      process.env.CHECKPOINT_DEBUG_STDOUT = undefined;
    });
  });
});

async function serve(handler) {
  const server = await new Promise((resolve) => {
    const s = http__default["default"].createServer(handler);
    s.listen(0, 'localhost', () => resolve(s));
  });
  const addr = server.address();
  if (!addr || typeof addr === 'string') {
    throw new Error('unable to start the server')
  }
  return {
    url: `http://${addr.address}:${addr.port}`,
    close: () => new Promise((res) => server.close(() => res())),
  }
}












// wait for the child to finish
async function wait(child) {
  let stdout = '';
  let stderr = '';

  if (child.exitCode !== null) {
    throw new Error('child already exited with exitCode')
  }

  if (child.signalCode !== null) {
    throw new Error('child already exited with signalCode')
  }

  if (child.stdout) {
    child.stdout.pipe(concatStream__default["default"]((data) => (stdout += data.toString('utf8'))));
  }
  if (child.stderr) {
    child.stderr.pipe(concatStream__default["default"]((data) => (stderr += data.toString('utf8'))));
  }
  const code = await new Promise((resolve, reject) => {
    child.once('error', (err) => reject(err));
    child.once('exit', (code) => resolve(code));
  });

  return {
    stdout: stdout,
    stderr: stderr,
    code: code,
  }
}

async function waitMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
