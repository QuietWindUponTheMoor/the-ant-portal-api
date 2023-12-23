"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashFileName = exports.createMD5 = void 0;
var crypto = require("crypto");
var path = require("path");
function createMD5(input) {
    var md5 = crypto.createHash("md5");
    var hash = md5.update(input, "utf8").digest("hex");
    return hash;
}
exports.createMD5 = createMD5;
function hashFileName(file_name) {
    // Split name and extension
    var _a = path.parse(file_name), name = _a.name, ext = _a.ext;
    // Hash the file name
    var hash = createMD5(name);
    // Put back together/concat and return
    return hash.concat(ext);
}
exports.hashFileName = hashFileName;
