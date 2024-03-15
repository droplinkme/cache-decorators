"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoCacheKeyExceptions = void 0;
class NoCacheKeyExceptions extends Error {
    constructor() {
        super(...arguments);
        this.status = 400;
    }
}
exports.NoCacheKeyExceptions = NoCacheKeyExceptions;
//# sourceMappingURL=no-cache-key.exception.js.map