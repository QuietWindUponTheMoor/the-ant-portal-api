// Imports
import * as fs from "fs";
import * as mysql from "mysql2/promise";
import { Pool, PoolOptions } from "mysql2/promise";
import {RequestHandler} from "./lib/requests/request_handler";
import * as dotenv from "dotenv";
dotenv.config();

// Set up database
try {
    // Configure database
    const dbConfig: PoolOptions = {
        host: validateEnvVar(process.env.host, "null"),
        port: validateEnvVarAsNumber(process.env.port),
        user: validateEnvVar(process.env.username, "null"),
        password: validateEnvVar(process.env.password, ""),
        database: validateEnvVar(process.env.database, "null")
    };

    // Get database
    const db: Pool = mysql.createPool(dbConfig);
} catch (error) {
    console.error(`Error connecting to database: ${error}`);
}

// Create handler class instance
const handler = new RequestHandler();
// Start the script
main();



async function main(): Promise<void> {
    // Testing
    handler._res("/", async (req, res) => {
        res.send("FUCK YOU");
    });
}

// Start express
handler.startServer();






// Helper functions
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