'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var writeFileFn = _interopDefault(require('fast-write-atomic'));
var makeDir = _interopDefault(require('make-dir'));
var path = _interopDefault(require('path'));
var util = _interopDefault(require('util'));
var fs = _interopDefault(require('fs'));
var tempfile = _interopDefault(require('tempfile'));
var assert = _interopDefault(require('assert'));

// imports

// promisify
const writeFile = util.promisify(writeFileFn);
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);

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
    await makeDir(path.dirname(state.cache_file));
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
    return
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

// Check tests
describe('config', () => {
  let config;

  // careful, these tests build off each other
  describe('set, all, get, reset, delete data', () => {
    before(async () => {
      const tmpfile = tempfile();
      config = await Config.new({ cache_file: tmpfile });
    });

    it('initial state', async () => {
      assert.deepStrictEqual(await config.all(), undefined);
    });

    it('set one', async () => {
      await config.set({
        last_reminder: 10,
      });
      assert.deepStrictEqual(await config.all(), {
        last_reminder: 10,
        cached_at: 0,
        version: '',
        cli_path: '',
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
      } );
    });

    it('set many', async () => {
      await config.set({
        cli_path: '',
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
          outdated: true,
          alerts: [],
        },
        version: '10',
      });
      assert.deepStrictEqual(await config.all(), {
        last_reminder: 10,
        cached_at: 0,
        version: '10',
        cli_path: '',
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
          outdated: true,
          alerts: [],
        },
      } );
    });

    it('reset the output', async () => {
      // reset the response
      await config.set({
        output: undefined,
        version: '10',
      });
      assert.deepStrictEqual(await config.all(), {
        last_reminder: 10,
        cached_at: 0,
        cli_path: '',
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
        version: '10',
      } );
    });

    it('get existing', async () => {
      // get the version
      const version = await config.get('version');
      assert.equal(version, 10);
    });

    it('reset fields', async () => {
      // reset all fields
      await config.reset();
      assert.deepStrictEqual(await config.all(), {
        last_reminder: 0,
        cached_at: 0,
        version: '',
        cli_path: '',
        output: {
          client_event_id: '',
          previous_client_event_id: '',
          product: '',
          local_timestamp: '',
          cli_path_hash: '',
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
      } );
    });

    it('deletes configuration', async () => {
      // delete the configuration
      await config.delete();
      assert.deepStrictEqual(await config.all(), undefined);
    });
  });
});
