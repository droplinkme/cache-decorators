"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adapter = void 0;
const implementations_1 = require("./implementations");
exports.adapter = {
    ioredis: () => implementations_1.IORedisCacheRepository
};
//# sourceMappingURL=adapter.js.map