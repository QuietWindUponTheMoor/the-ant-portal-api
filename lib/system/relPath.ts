const path = require("path");

export function getPathRelativeToRoot(relativePath: string): string {
    // Get the current working directory
    const cwd = process.cwd();
    // Resolve the absolute path to the root directory
    const rootPath = path.resolve(cwd, "");
    // Resolve the path relative to the root directory
    const fullPath = path.resolve(rootPath, relativePath);
    return fullPath;
}