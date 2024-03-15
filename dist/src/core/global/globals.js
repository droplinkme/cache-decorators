"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadataArgsStorage = void 0;
const metadata_args_storage_1 = require("./metadata-args/metadata-args.storage");
function getMetadataArgsStorage() {
    if (!global.metadataArgsStorage) {
        global.metadataArgsStorage = new metadata_args_storage_1.MetadataArgsStorage();
    }
    return global.metadataArgsStorage;
}
exports.getMetadataArgsStorage = getMetadataArgsStorage;
//# sourceMappingURL=globals.js.map