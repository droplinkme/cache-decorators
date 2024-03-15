"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSource = void 0;
const adapter_1 = require("./adapter");
const globals_1 = require("@core/global/globals");
const exceptions_1 = require("@core/exceptions");
class DataSource {
    initialize(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const Datasource = adapter_1.adapter[(_a = options.adpter) !== null && _a !== void 0 ? _a : 'ioredis']();
            yield Datasource.connect(options);
            const instace = new Datasource();
            (0, globals_1.getMetadataArgsStorage)().setCacheRepository(instace);
            return instace;
        });
    }
    getRepository() {
        const repository = (0, globals_1.getMetadataArgsStorage)().getCacheRepository();
        if (!repository)
            throw new exceptions_1.NoCacheRepositoryExceptions();
        return repository;
    }
    setRepository(repository) {
        if (!repository)
            throw new exceptions_1.NoCacheRepositoryExceptions();
        (0, globals_1.getMetadataArgsStorage)().setCacheRepository(repository);
    }
}
exports.DataSource = DataSource;
//# sourceMappingURL=datasource.js.map