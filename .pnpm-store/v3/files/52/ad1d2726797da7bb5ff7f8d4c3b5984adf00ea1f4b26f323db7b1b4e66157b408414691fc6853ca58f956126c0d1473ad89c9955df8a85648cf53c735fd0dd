var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  createLineStream: () => createLineStream,
  default: () => byline
});
const stream = require("stream"), util = require("util");
function byline(readStream, options) {
  return module.exports.createStream(readStream, options);
}
module.exports.createStream = function(readStream, options) {
  if (readStream) {
    return createLineStream(readStream, options);
  } else {
    return new LineStream(options);
  }
};
function createLineStream(readStream, options) {
  if (!readStream) {
    throw new Error("expected readStream");
  }
  if (!readStream.readable) {
    throw new Error("readStream must be readable");
  }
  const ls = new LineStream(options);
  readStream.pipe(ls);
  return ls;
}
module.exports.LineStream = LineStream;
function LineStream(options) {
  stream.Transform.call(this, options);
  options = options || {};
  this._readableState.objectMode = true;
  this._lineBuffer = [];
  this._keepEmptyLines = options.keepEmptyLines || false;
  this._lastChunkEndedWithCR = false;
  this.on("pipe", function(src) {
    if (!this.encoding) {
      if (src instanceof stream.Readable) {
        this.encoding = src._readableState.encoding;
      }
    }
  });
}
util.inherits(LineStream, stream.Transform);
LineStream.prototype._transform = function(chunk, encoding, done) {
  encoding = encoding || "utf8";
  if (Buffer.isBuffer(chunk)) {
    if (encoding == "buffer") {
      chunk = chunk.toString();
      encoding = "utf8";
    } else {
      chunk = chunk.toString(encoding);
    }
  }
  this._chunkEncoding = encoding;
  const lines = chunk.split(/\r\n|\r|\n/g);
  if (this._lastChunkEndedWithCR && chunk[0] == "\n") {
    lines.shift();
  }
  if (this._lineBuffer.length > 0) {
    this._lineBuffer[this._lineBuffer.length - 1] += lines[0];
    lines.shift();
  }
  this._lastChunkEndedWithCR = chunk[chunk.length - 1] == "\r";
  this._lineBuffer = this._lineBuffer.concat(lines);
  this._pushBuffer(encoding, 1, done);
};
LineStream.prototype._pushBuffer = function(encoding, keep, done) {
  while (this._lineBuffer.length > keep) {
    const line = this._lineBuffer.shift();
    if (this._keepEmptyLines || line.length > 0) {
      if (!this.push(this._reencode(line, encoding))) {
        const self = this;
        setImmediate(function() {
          self._pushBuffer(encoding, keep, done);
        });
        return;
      }
    }
  }
  done();
};
LineStream.prototype._flush = function(done) {
  this._pushBuffer(this._chunkEncoding, 0, done);
};
LineStream.prototype._reencode = function(line, chunkEncoding) {
  if (this.encoding && this.encoding != chunkEncoding) {
    return Buffer.from(line, chunkEncoding).toString(this.encoding);
  } else if (this.encoding) {
    return line;
  } else {
    return Buffer.from(line, chunkEncoding);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createLineStream
});
