"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHash = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
function getHash(filePath) {
    const hash = crypto_1.default.createHash('sha256');
    const input = fs_1.default.createReadStream(filePath);
    return new Promise((resolve) => {
        input.on('readable', () => {
            const data = input.read();
            if (data) {
                hash.update(data);
            }
            else {
                resolve(hash.digest('hex'));
            }
        });
    });
}
exports.getHash = getHash;
//# sourceMappingURL=getHash.js.map