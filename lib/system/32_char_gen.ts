import * as crypto from "crypto";

export function gen_rand_string(length: number = 32): string {
    const bytes = crypto.randomBytes(length / 2);
    return bytes.toString("hex");
}