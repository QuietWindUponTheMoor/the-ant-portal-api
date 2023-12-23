// Imports
import * as fs from "fs";
import {RequestHandler} from "./lib/requests/request_handler";
import {Register} from "./lib/routes/register";

// Create handler class instance
const handler: RequestHandler = new RequestHandler();
// Start the script
main();

async function main(): Promise<void> {
    // Testing
    const Reg = new Register(handler);
    //Reg.processRequest();
    Reg.processRequest();
}

// Start express
handler.startServer();