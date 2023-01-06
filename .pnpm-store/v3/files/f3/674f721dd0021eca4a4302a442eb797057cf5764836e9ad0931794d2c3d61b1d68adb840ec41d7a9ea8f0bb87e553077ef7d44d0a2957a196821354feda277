"use strict";
// Why is this in getPlatform... because of our dependency tree
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeAPIName = void 0;
const NODE_API_QUERY_ENGINE_URL_BASE = 'libquery_engine';
/**
 * Gets Node-API Library name depending on the platform
 * @param platform
 * @param type  `fs` gets name used on the file system, `url` gets the name required to download the library from S3
 * @returns
 */
function getNodeAPIName(platform, type) {
    const isUrl = type === 'url';
    if (platform.includes('windows')) {
        return isUrl ? `query_engine.dll.node` : `query_engine-${platform}.dll.node`;
    }
    else if (platform.includes('darwin')) {
        return isUrl
            ? `${NODE_API_QUERY_ENGINE_URL_BASE}.dylib.node`
            : `${NODE_API_QUERY_ENGINE_URL_BASE}-${platform}.dylib.node`;
    }
    else {
        return isUrl
            ? `${NODE_API_QUERY_ENGINE_URL_BASE}.so.node`
            : `${NODE_API_QUERY_ENGINE_URL_BASE}-${platform}.so.node`;
    }
}
exports.getNodeAPIName = getNodeAPIName;
//# sourceMappingURL=getNodeAPIName.js.map