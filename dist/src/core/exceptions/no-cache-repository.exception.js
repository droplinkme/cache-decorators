"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoCacheRepositoryExceptions = void 0;
class NoCacheRepositoryExceptions extends Error {
    constructor(message = 'Repository cache was not instantiated') {
        super(message);
        this.status = 404;
    }
}
exports.NoCacheRepositoryExceptions = NoCacheRepositoryExceptions;
//# sourceMappingURL=no-cache-repository.exception.js.map