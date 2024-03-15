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
exports.CacheRetrieve = void 0;
const create_cache_decorator_1 = require("../create-cache-decorator");
function CacheRetrieve(input) {
    const action = (_a) => __awaiter(this, [_a], void 0, function* ({ instance, key, method, args, repository, }) {
        const fn = () => method.apply(instance, args);
        return yield repository.recoverOrSave(key, fn, input.ttl, input.no_cache);
    });
    return (0, create_cache_decorator_1.createCacheDecorator)(input, action);
}
exports.CacheRetrieve = CacheRetrieve;
//# sourceMappingURL=cache-retrieve.decorator.js.map