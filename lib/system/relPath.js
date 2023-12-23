"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathRelativeToRoot = void 0;
var path = require("path");
function getPathRelativeToRoot(relativePath) {
    // Get the current working directory
    var cwd = process.cwd();
    // Resolve the absolute path to the root directory
    var rootPath = path.resolve(cwd, "");
    // Resolve the path relative to the root directory
    var fullPath = path.resolve(rootPath, relativePath);
    return fullPath;
}
exports.getPathRelativeToRoot = getPathRelativeToRoot;
