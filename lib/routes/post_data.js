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
exports.PostData = void 0;
var init_1 = require("../database/init");
var PostData = /** @class */ (function () {
    function PostData(handler) {
        this.__ok = 200;
        this.__bad_request = 400;
        this.handler = handler;
    }
    PostData.prototype.processPostData = function () {
        var _this = this;
        // Initialize status
        var fail_reason = "";
        var pass_fail = true;
        // Handle the request
        this.handler._res("/fetch_post_data", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var post_data, data, login_status, post_id, fetch_check, fetch_successful, fetch_fail_reason, increment_check, increment_successful, increment_fail_reason, reply_data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        post_data = null;
                        data = req.fields;
                        login_status = parseInt(data.login_status);
                        post_id = data.post_id;
                        // Log the login status of the user
                        console.log("User tried fetching post data with login_status ".concat(login_status));
                        if (!(login_status !== 200)) return [3 /*break*/, 1];
                        // Client is not logged in
                        pass_fail = false;
                        fail_reason = "The user is not logged in.";
                        return [3 /*break*/, 4];
                    case 1:
                        if (!(post_id === null)) return [3 /*break*/, 2];
                        // Post ID is not valid
                        pass_fail = false;
                        fail_reason = "The post id ".concat(post_id, " is not valid.");
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.fetchPostData(post_id)];
                    case 3:
                        fetch_check = _a.sent();
                        fetch_successful = fetch_check.validated;
                        fetch_fail_reason = fetch_check.reason;
                        post_data = fetch_check.post_data;
                        if (!fetch_successful) {
                            pass_fail = false;
                            fail_reason = fetch_fail_reason;
                        }
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.incrementViewCount(post_id)];
                    case 5:
                        increment_check = _a.sent();
                        increment_successful = increment_check.validated;
                        increment_fail_reason = increment_check.reason;
                        if (!increment_successful) {
                            pass_fail = false;
                            fail_reason = increment_fail_reason;
                        }
                        if (pass_fail === false || post_data === null) {
                            reply_data = {
                                status: this.__bad_request,
                                message: "Fetch data failed",
                                details: fail_reason,
                                post_data: null
                            };
                        }
                        else if (pass_fail === true) {
                            reply_data = {
                                status: this.__ok,
                                message: "Fetched data successfully",
                                details: fail_reason,
                                post_data: post_data
                            };
                        }
                        // Log reply data
                        if (pass_fail === false) {
                            console.error(reply_data);
                        }
                        else {
                            console.log({
                                status: this.__ok,
                                message: "Fetched data successfully",
                                details: fail_reason
                            });
                        }
                        // Reply to client
                        res.json(reply_data);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    PostData.prototype.incrementViewCount = function (post_id) {
        return __awaiter(this, void 0, void 0, function () {
            var fail_reason, pass_fail, post_data, view_count, query_response, data, increment_response_data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fail_reason = "";
                        pass_fail = true;
                        view_count = 0;
                        return [4 /*yield*/, init_1.db.query("SELECT views FROM posts WHERE postID=?;", [post_id])];
                    case 1:
                        data = _a.sent();
                        if (data[0].length < 1) {
                            pass_fail = false;
                            fail_reason = "Cannot fetch view_count for post ".concat(post_id, ".");
                            post_data = null;
                        }
                        else {
                            post_data = data[0][0];
                            view_count = post_data.views;
                        }
                        if (!(pass_fail !== false)) return [3 /*break*/, 3];
                        // Increment view count and update
                        view_count++;
                        return [4 /*yield*/, init_1.db.query("UPDATE posts SET views=? WHERE postID=?;", [view_count, post_id])];
                    case 2:
                        query_response = _a.sent();
                        _a.label = 3;
                    case 3:
                        increment_response_data = query_response[0];
                        if (increment_response_data.serverStatus !== 2) {
                            // If request failed in any way
                            fail_reason = "Query failed: ".concat({ server_status: data.serverStatus, details: data.info, warning_status: data.warningStatus });
                            pass_fail = false;
                        }
                        else {
                            console.log("\u001B[33m Incremented view_count for post \u001B[32m".concat(post_id, "\u001B[0m"));
                        }
                        // If all else is good, return result
                        return [2 /*return*/, {
                                validated: pass_fail,
                                reason: fail_reason,
                                post_data: post_data
                            }];
                }
            });
        });
    };
    PostData.prototype.fetchPostData = function (post_id) {
        return __awaiter(this, void 0, void 0, function () {
            var fail_reason, pass_fail, post_data, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fail_reason = "";
                        pass_fail = true;
                        return [4 /*yield*/, init_1.db.query("SELECT * FROM posts WHERE postID=?;", [post_id])];
                    case 1:
                        data = _a.sent();
                        if (data[0].length < 1) {
                            pass_fail = false;
                            fail_reason = "No records were found for the post ID ".concat(post_id, ".");
                            post_data = null;
                        }
                        else {
                            post_data = data[0][0];
                        }
                        // If all else is good, return result
                        return [2 /*return*/, {
                                validated: pass_fail,
                                reason: fail_reason,
                                post_data: post_data
                            }];
                }
            });
        });
    };
    return PostData;
}());
exports.PostData = PostData;
