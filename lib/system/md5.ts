import * as crypto from "crypto";
const path = require("path");

export function createMD5(input: string) {
    const md5 = crypto.createHash("md5");
    const hash = md5.update(input, "utf8").digest("hex");
    return hash;
}

export function hashFileName(file_name: string) {
    // Split name and extension
    const {name, ext} = path.parse(file_name);
    // Hash the file name
    const hash: string = createMD5(name);
    // Put back together/concat and return
    return hash.concat(ext);
}