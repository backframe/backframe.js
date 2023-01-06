"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNodeAPISupported = void 0;
const fs_1 = __importDefault(require("fs"));
const _1 = require(".");
/**
 * Determines whether Node API is supported on the current platform and throws if not
 */
async function isNodeAPISupported() {
    const customLibraryPath = process.env.PRISMA_QUERY_ENGINE_LIBRARY;
    const customLibraryExists = customLibraryPath && fs_1.default.existsSync(customLibraryPath);
    const os = await _1.getos();
    if (!customLibraryExists && (os.arch === 'x32' || os.arch === 'ia32')) {
        throw new Error(`Node-API is currently not supported for 32bit Node. Please remove \`nApi\` from the "previewFeatures" attribute in the "generator" block of the "schema.prisma", or remove the "PRISMA_FORCE_NAPI" environment variable.`);
    }
}
exports.isNodeAPISupported = isNodeAPISupported;
//# sourceMappingURL=isNodeAPISupported.js.map