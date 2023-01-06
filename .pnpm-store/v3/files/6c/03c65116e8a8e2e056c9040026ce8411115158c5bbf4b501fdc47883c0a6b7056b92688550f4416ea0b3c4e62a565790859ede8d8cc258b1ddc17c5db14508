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
    const os = await (0, _1.getos)();
    if (!customLibraryExists && (os.arch === 'x32' || os.arch === 'ia32')) {
        throw new Error(`The default query engine type (Node-API, "library") is currently not supported for 32bit Node. Please set \`engineType = "binary"\` in the "generator" block of your "schema.prisma" file (or use the environment variables "PRISMA_CLIENT_ENGINE_TYPE=binary" and/or "PRISMA_CLI_QUERY_ENGINE_TYPE=binary".)`);
    }
}
exports.isNodeAPISupported = isNodeAPISupported;
//# sourceMappingURL=isNodeAPISupported.js.map