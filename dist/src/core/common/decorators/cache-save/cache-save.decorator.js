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
exports.CacheSave = void 0;
const create_cache_decorator_1 = require("../create-cache-decorator");
const utils_1 = require("../../utils");
function CacheSave(input) {
    const action = (_a) => __awaiter(this, [_a], void 0, function* ({ instance, method, args, repository }) {
        const output = yield method.apply(instance, args);
        const key = yield (0, utils_1.getKey)(Object.assign(Object.assign({}, input), { input: args[0], output }));
        yield repository.save(key, output, input.ttl);
        return output;
    });
    return (0, create_cache_decorator_1.createCacheDecorator)(input, action, true);
}
exports.CacheSave = CacheSave;
//# sourceMappingURL=cache-save.decorator.js.map