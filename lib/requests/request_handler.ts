import cors = require("cors");
import express = require("express");
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
const formidable = require("express-formidable");

export class RequestHandler {
    // Constant
    private app: any;
    private port: number;

    // Dynamic

    public constructor() {
        // Set up express
        const app: any = express();
        const port: number = 81;
        this.app = app;
        this.port = port;

        // Use cors
        this.app.use(cors({origin: "*"}));
        // Enable parsing of body data
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        app.use(formidable());
    }

    public startServer(): void {
        this.app.listen(this.port, async () => {
            console.log(`The Ant Lab API started on port ${this.port}`);
        });
    }

    public _res(uri: string, __callback: (req: Request, res: Response) => void): void {
        this.app.post(uri, (req: Request, res: Response) => {
            __callback(req, res);
        });
    }
}