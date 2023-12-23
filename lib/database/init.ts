import * as dotenv from "dotenv";
dotenv.config();
import * as mysql from "mysql2/promise";
import { Pool, PoolOptions } from "mysql2/promise";

// Configure database
const dbConfig: PoolOptions = {
    host: validateEnvVar(process.env.host, "null"),
    port: validateEnvVarAsNumber(process.env.port),
    user: validateEnvVar(process.env.user, "null"),
    password: validateEnvVar(process.env.password, ""),
    database: validateEnvVar(process.env.database, "null")
};

// Set up database and export
const db: Pool = createDB(dbConfig);
export {db};

function validateEnvVar(envVar: string | undefined, defaultValue: string): string {
    return envVar !== undefined ? envVar : defaultValue;
};
function validateEnvVarAsNumber(value: string | undefined): number {
    const parsedValue = parseInt(value || "", 10);
    if (isNaN(parsedValue)) {
        throw new Error("Invalid or undefined numeric value in environment variable.");
    }
    return parsedValue;
}
function createDB(config: PoolOptions): Pool {
    const db: Pool = mysql.createPool(config);
    return db;
}