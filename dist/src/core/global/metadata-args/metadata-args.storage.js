"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataArgsStorage = void 0;
const exceptions_1 = require("@core/exceptions");
class MetadataArgsStorage {
    getCacheRepository() {
        if (!this.cacheRepository) {
            throw new exceptions_1.NoCacheRepositoryExceptions("Cache repository not initialized");
        }
        return this.cacheRepository;
    }
    setCacheRepository(repository) {
        this.cacheRepository = repository;
    }
}
exports.MetadataArgsStorage = MetadataArgsStorage;
//# sourceMappingURL=metadata-args.storage.js.map