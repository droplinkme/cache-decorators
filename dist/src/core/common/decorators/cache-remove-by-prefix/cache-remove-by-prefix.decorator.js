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
exports.CacheRemoveByPrefix = void 0;
const create_cache_decorator_1 = require("../create-cache-decorator");
function CacheRemoveByPrefix(input) {
    const action = (_a) => __awaiter(this, [_a], void 0, function* ({ instance, key, method, args, repository, }) {
        const output = yield method.apply(instance, args);
        yield repository.removeByPrefix(key);
        return output;
    });
    return (0, create_cache_decorator_1.createCacheDecorator)(input, action);
}
exports.CacheRemoveByPrefix = CacheRemoveByPrefix;
//# sourceMappingURL=cache-remove-by-prefix.decorator.js.map