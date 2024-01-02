"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gen_rand_string = void 0;
var crypto = require("crypto");
function gen_rand_string(length) {
    if (length === void 0) { length = 32; }
    var bytes = crypto.randomBytes(length / 2);
    return bytes.toString("hex");
}
exports.gen_rand_string = gen_rand_string;
