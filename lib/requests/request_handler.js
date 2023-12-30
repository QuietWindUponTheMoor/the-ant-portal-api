"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestHandler = void 0;
var cors = require("cors");
var express = require("express");
var bodyParser = require("body-parser");
var formidable = require("express-formidable");
var session = require("express-session");
var path = require("path");
var RequestHandler = /** @class */ (function () {
    // Dynamic
    function RequestHandler(root_dir) {
        this.root_dir = "";
        // Set up express
        var app = express();
        var port = 81;
        this.app = app;
        this.port = port;
        this.root_dir = root_dir;
        // Use cors
        this.app.use(cors({ origin: "*" }));
        // Enable parsing of body data
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(formidable());
        app.use(session({
            secret: process.env.secret, // Replace with a secure secret
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: false, // Set to true if using HTTPS
                maxAge: (60 * 60 * 1000) * 12 // 12 hours
            }
        }));
        // Allow uploaded files to be discovered
        app.use("/files", express.static(path.join(this.root_dir, "user_uploads", "profile_images")));
    }
    RequestHandler.prototype.startServer = function () {
        var _this = this;
        this.app.listen(this.port, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("The Ant Lab API started on port ".concat(this.port));
                return [2 /*return*/];
            });
        }); });
    };
    RequestHandler.prototype._res = function (uri, __callback) {
        this.app.post(uri, function (req, res) {
            __callback(req, res);
        });
    };
    RequestHandler.prototype.fetchLoginSession = function () {
        this.app.post("/user_data", function (req, res) {
            if (req.session.user) {
                res.json({
                    status: 200,
                    details: req.session.user
                });
            }
            else {
                res.json({
                    status: 400,
                    details: "A session for this user does not exist."
                });
            }
        });
    };
    RequestHandler.prototype.destroySession = function (req, res) {
        req.session.destroy(function (error) {
            if (error) {
                console.log(error);
                res.json({
                    status: 400,
                    message: "Failed to destroy session",
                    details: "The session could not be destroyed."
                });
            }
            else {
                console.log("Session was destroyed.");
                res.json({
                    status: 200,
                    message: "Session destroyed",
                    details: ""
                });
            }
        });
    };
    return RequestHandler;
}());
exports.RequestHandler = RequestHandler;
