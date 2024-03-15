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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IORedisCacheRepository = void 0;
const crypto_1 = require("crypto");
const ioredis_1 = __importDefault(require("ioredis"));
const exceptions_1 = require("@core/exceptions");
class IORedisCacheRepository {
    static connect(config) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (IORedisCacheRepository._client) {
                return;
            }
            try {
                IORedisCacheRepository._client = new ioredis_1.default({
                    host: config.host,
                    port: (_a = config.port) !== null && _a !== void 0 ? _a : 6379,
                    password: config.password,
                    commandTimeout: (_b = config.timeout) !== null && _b !== void 0 ? _b : 5000,
                    retryStrategy: config.retryStrategy,
                    reconnectOnError: config.reconnectOnError,
                    maxRetriesPerRequest: config.maxRetries
                });
            }
            catch (err) {
                throw err;
            }
        });
    }
    static disconnect() {
        if (IORedisCacheRepository._client) {
            IORedisCacheRepository._client.disconnect();
        }
    }
    save(key, value, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                IORedisCacheRepository.validateConnection();
                const valueStr = JSON.stringify(value);
                ttl
                    ? yield IORedisCacheRepository._client.set(key, valueStr, 'EX', ttl)
                    : yield IORedisCacheRepository._client.set(key, valueStr);
            }
            catch (err) {
                throw err;
            }
            return value;
        });
    }
    getValuesByPattern(pattern) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                IORedisCacheRepository.validateConnection();
                const stream = IORedisCacheRepository._client.scanStream({
                    match: pattern,
                    count: 10
                });
                const result = yield new Promise((resolve, reject) => {
                    const keys = new Set();
                    stream.on('data', (data) => {
                        data.forEach(keys.add, keys);
                    });
                    stream.on('error', (err) => {
                        reject(err);
                    });
                    stream.on('end', () => __awaiter(this, void 0, void 0, function* () {
                        if (keys.size === 0) {
                            resolve([]);
                        }
                        const values = yield Promise.all([...keys].map((key) => __awaiter(this, void 0, void 0, function* () {
                            const result = yield IORedisCacheRepository._client.get(key);
                            if (result) {
                                return JSON.parse(result);
                            }
                        })));
                        resolve(values);
                    }));
                });
                return result;
            }
            catch (err) {
                throw err;
            }
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                IORedisCacheRepository.validateConnection();
                yield IORedisCacheRepository._client.del(key);
            }
            catch (err) {
                throw err;
            }
        });
    }
    removeByPrefix(prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                IORedisCacheRepository.validateConnection();
                const pipeline = IORedisCacheRepository._client.pipeline();
                yield IORedisCacheRepository._client
                    .keys(`${prefix}*`)
                    .then((keys) => { keys.forEach((key) => pipeline.del(key)); });
                yield pipeline.exec();
            }
            catch (err) {
                throw err;
            }
        });
    }
    recover(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                IORedisCacheRepository.validateConnection();
                const valueStr = yield IORedisCacheRepository._client.get(key);
                if (valueStr)
                    return JSON.parse(valueStr);
            }
            catch (err) {
                throw err;
            }
        });
    }
    invalidate(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                IORedisCacheRepository.validateConnection();
                yield IORedisCacheRepository._client.expire(key, 1);
            }
            catch (err) {
                throw err;
            }
        });
    }
    flushAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                IORedisCacheRepository.validateConnection();
                yield IORedisCacheRepository._client.flushall();
            }
            catch (err) {
                throw err;
            }
        });
    }
    static validateConnection() {
        if (IORedisCacheRepository._client.status !== 'ready') {
            throw new exceptions_1.ConnectionExceptions('RedisCacheRepository not connected');
        }
    }
    createHashedKey(hashable, prefix) {
        const hash = (0, crypto_1.createHash)('md5')
            .update(JSON.stringify(hashable))
            .digest('hex');
        return `${prefix !== null && prefix !== void 0 ? prefix : ''}${hash}`;
    }
    recoverOrSave(key, fn, ttl, no_cache) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!no_cache) {
                const cachedValue = yield this.recover(key);
                if (cachedValue)
                    return cachedValue;
            }
            try {
                const value = yield fn();
                return yield this.save(key, value, ttl);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.IORedisCacheRepository = IORedisCacheRepository;
//# sourceMappingURL=ioredis.repository.js.map