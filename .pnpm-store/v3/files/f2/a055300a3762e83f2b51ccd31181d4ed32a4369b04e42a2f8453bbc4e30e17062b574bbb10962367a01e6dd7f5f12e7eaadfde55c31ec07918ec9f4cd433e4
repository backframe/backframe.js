'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var paths = _interopDefault(require('env-paths'));
var assert = _interopDefault(require('assert'));

function getCacheFolder() {
  return paths('checkpoint').cache
}

// Imports

// Check tests
describe('getCacheFolder', async () => {
  it('should return the cache folder', async () => {
    const cacheFolder = await getCacheFolder();
    assert.equal(typeof cacheFolder, 'string');
    assert.equal(cacheFolder.includes('checkpoint-nodejs'), true);
  });
});
