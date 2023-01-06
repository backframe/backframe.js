"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asError = exports.isError = void 0;
function isObject(value) {
    return typeof value === 'object' && value != null;
}
function getObjectMessage(obj) {
    if (typeof obj.message === 'string') {
        return obj.message;
    }
    if (obj.toString !== Object.prototype.toString) {
        return obj.toString();
    }
    try {
        return JSON.stringify(obj);
    }
    catch (_a) {
        return String(obj);
    }
}
function isError(err) {
    return (isObject(err) &&
        typeof err.name === 'string' &&
        typeof err.message === 'string' &&
        (!('stack' in err) || typeof err.stack === 'string'));
}
exports.isError = isError;
function asError(err) {
    if (isError(err))
        return err;
    const name = (isObject(err) && err.constructor.name) || typeof err;
    const message = isObject(err) ? getObjectMessage(err) : String(err);
    return { name, message };
}
exports.asError = asError;
//# sourceMappingURL=index.js.map