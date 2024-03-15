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
exports.createCacheDecorator = void 0;
const utils_1 = require("../utils");
const globals_1 = require("@core/global/globals");
function createCacheDecorator(input, action, ignore_key = false) {
    return function (target, propertyKey, descriptor) {
        const method = descriptor.value;
        descriptor.value = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                const repository = (0, globals_1.getMetadataArgsStorage)().getCacheRepository();
                const key = !ignore_key ? yield (0, utils_1.getKey)(Object.assign(Object.assign({}, input), { input: args[0] })) : undefined;
                return action({ instance: this, method, args, key, repository });
            });
        };
        return descriptor;
    };
}
exports.createCacheDecorator = createCacheDecorator;
//# sourceMappingURL=create-cache-decorator.js.map