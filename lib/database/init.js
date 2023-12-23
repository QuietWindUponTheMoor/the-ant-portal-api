"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var dotenv = require("dotenv");
dotenv.config();
var mysql = require("mysql2/promise");
// Configure database
var dbConfig = {
    host: validateEnvVar(process.env.host, "null"),
    port: validateEnvVarAsNumber(process.env.port),
    user: validateEnvVar(process.env.user, "null"),
    password: validateEnvVar(process.env.password, ""),
    database: validateEnvVar(process.env.database, "null")
};
// Set up database and export
var db = createDB(dbConfig);
exports.db = db;
function validateEnvVar(envVar, defaultValue) {
    return envVar !== undefined ? envVar : defaultValue;
}
;
function validateEnvVarAsNumber(value) {
    var parsedValue = parseInt(value || "", 10);
    if (isNaN(parsedValue)) {
        throw new Error("Invalid or undefined numeric value in environment variable.");
    }
    return parsedValue;
}
function createDB(config) {
    var db = mysql.createPool(config);
    return db;
}
