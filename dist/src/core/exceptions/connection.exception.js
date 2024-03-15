"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionExceptions = void 0;
class ConnectionExceptions extends Error {
    constructor() {
        super(...arguments);
        this.status = 500;
    }
}
exports.ConnectionExceptions = ConnectionExceptions;
//# sourceMappingURL=connection.exception.js.map