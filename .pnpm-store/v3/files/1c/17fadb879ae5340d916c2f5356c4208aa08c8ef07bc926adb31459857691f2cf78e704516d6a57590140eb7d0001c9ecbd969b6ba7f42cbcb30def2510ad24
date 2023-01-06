"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBar = void 0;
const progress_1 = __importDefault(require("progress"));
function getBar(text) {
    return new progress_1.default(`> ${text} [:bar] :percent`, {
        stream: process.stdout,
        width: 20,
        complete: '=',
        incomplete: ' ',
        total: 100,
        head: '',
        clear: true,
    });
}
exports.getBar = getBar;
//# sourceMappingURL=log.js.map