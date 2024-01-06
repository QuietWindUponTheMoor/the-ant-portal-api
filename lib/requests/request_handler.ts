import cors = require("cors");
import express = require("express");
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
const formidable = require("express-formidable");
const session = require("express-session");
const path = require("path");

export class RequestHandler {
    // Constant
    private app: any;
    private port: number;
    private root_dir: string = "";

    // Dynamic

    public constructor(root_dir: string) {
        // Set up express
        const app: any = express();
        const port: number = 81;
        this.app = app;
        this.port = port;
        this.root_dir = root_dir;

        // Use cors
        this.app.use(cors({origin: "*"}));
        // Enable parsing of body data
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        // Use express.formidable() for file parsing
        app.use(formidable());
        app.use(session({ // This is for sessions
            secret: process.env.secret,
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: false, // Set to true if using HTTPS
                maxAge: (60 * 60 * 1000) * 12 // 12 hours
            }
        }));
        // Allow uploaded files to be discovered
        app.use("/files", express.static(path.join(this.root_dir, "user_uploads", "profile_images")));
        app.use("/post_files", express.static(path.join(this.root_dir, "user_uploads", "posts")));
    }

    public startServer(port: number = this.port): void {
        this.app.listen(port, async () => {
            console.log(`The Ant Lab API started on port ${port}`);
        });
    }

    public _res(uri: string, __callback: (req: Request, res: Response) => void): void {
        this.app.post(uri, (req: Request, res: Response) => {
            __callback(req, res);
        });
    }

    public fetchLoginSession() {
        this.app.post("/user_data", (req: any, res: any) => {
            if (req.session.user) {
                res.json({
                    status: 200,
                    details: req.session.user
                });
            } else {
                res.json({
                    status: 400,
                    details: "A session for this user does not exist."
                });
            }
        });
    }

    public destroySession(req: any, res: any): void {
        req.session.destroy((error: any) => {
            if (error) {
                console.log(error);
                res.json({
                    status: 400,
                    message: "Failed to destroy session",
                    details: "The session could not be destroyed."
                });
            } else {
                console.log("Session was destroyed.");
                res.json({
                    status: 200,
                    message: "Session destroyed",
                    details: ""
                });
            }
        });
    }
}