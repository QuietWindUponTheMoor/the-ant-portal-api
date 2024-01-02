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
exports.Signin = void 0;
var init_1 = require("../database/init");
var passHash_1 = require("../system/passHash");
var Signin = /** @class */ (function () {
    function Signin(handler) {
        this.__ok = 200;
        this.__bad_request = 400;
        this.handler = handler;
    }
    Signin.prototype.processRegister = function () {
        var _this = this;
        // Initialize status
        var fail_reason = "";
        var pass_fail = true;
        // Handle the request
        this.handler._res("/signin", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var data, login, pass, login_check, login_valid, login_fail_reason, login_type, pass_check, pass_valid, pass_fail_reason, user_id, id_fetch, id_valid, id_fail_reason, login_fetch, login_valid_1, login_fail_reason_1, reply_data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = req.fields;
                        login = data.login;
                        pass = data.pass;
                        return [4 /*yield*/, this.validateLogin(login)];
                    case 1:
                        login_check = _a.sent();
                        login_valid = login_check.validated;
                        login_fail_reason = login_check.reason;
                        login_type = login_check.login_type;
                        if (!login_valid) {
                            pass_fail = false;
                            fail_reason = login_fail_reason;
                        }
                        if (!(pass_fail !== false)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.validatePassword(pass, login_type, login)];
                    case 2:
                        pass_check = _a.sent();
                        pass_valid = pass_check.validated;
                        pass_fail_reason = pass_check.reason;
                        if (!pass_valid) {
                            pass_fail = false;
                            fail_reason = pass_fail_reason;
                        }
                        _a.label = 3;
                    case 3:
                        user_id = 0;
                        if (!(pass_fail !== false)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.fetchUserID(login_type, login)];
                    case 4:
                        id_fetch = _a.sent();
                        id_valid = id_fetch.validated;
                        id_fail_reason = id_fetch.reason;
                        user_id = id_fetch.user_id;
                        if (!id_valid) {
                            pass_fail = false;
                            fail_reason = id_fail_reason;
                        }
                        _a.label = 5;
                    case 5:
                        if (!(pass_fail !== false)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.__login(req, user_id)];
                    case 6:
                        login_fetch = _a.sent();
                        login_valid_1 = login_fetch.validated;
                        login_fail_reason_1 = login_fetch.reason;
                        if (!login_valid_1) {
                            pass_fail = false;
                            fail_reason = login_fail_reason_1;
                        }
                        _a.label = 7;
                    case 7:
                        if (pass_fail === false) {
                            reply_data = {
                                status: this.__bad_request,
                                message: "Signin failed",
                                details: fail_reason,
                                user_data: null
                            };
                        }
                        else if (pass_fail === true) {
                            reply_data = {
                                status: this.__ok,
                                message: "Signin successful",
                                details: fail_reason,
                                user_data: req.session.user
                            };
                        }
                        // Reply to client
                        res.json(reply_data);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Signin.prototype.__login = function (req, user_id) {
        return __awaiter(this, void 0, void 0, function () {
            var fail_reason, pass_fail, user_data, user_data_valid, user_data_fail_reason, email, username, image;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fail_reason = "";
                        pass_fail = true;
                        return [4 /*yield*/, this.fetchUserData(user_id)];
                    case 1:
                        user_data = _a.sent();
                        user_data_valid = user_data.validated;
                        user_data_fail_reason = user_data.reason;
                        email = user_data.email;
                        username = user_data.username;
                        image = user_data.image;
                        if (!user_data_valid) {
                            pass_fail = false;
                            fail_reason = user_data_fail_reason;
                        }
                        // Login the user if nothing has failed to this point
                        if (pass_fail !== false) {
                            req.session.user = {
                                user_id: user_id,
                                username: username,
                                email: email,
                                image: image
                            };
                        }
                        // If all else is good, return result
                        return [2 /*return*/, {
                                validated: pass_fail,
                                reason: fail_reason
                            }];
                }
            });
        });
    };
    Signin.prototype.fetchUserID = function (login_type, login) {
        return __awaiter(this, void 0, void 0, function () {
            var fail_reason, pass_fail, user_id, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fail_reason = "";
                        pass_fail = true;
                        user_id = 0;
                        return [4 /*yield*/, init_1.db.query("SELECT userID FROM users WHERE ".concat(login_type, "=?;"), [login])];
                    case 1:
                        data = _a.sent();
                        if (data[0].length < 1) {
                            pass_fail = false;
                            fail_reason = "No records were found for that login.";
                        }
                        else {
                            user_id = data[0][0].userID;
                        }
                        // If all else is good, return result
                        return [2 /*return*/, {
                                validated: pass_fail,
                                reason: fail_reason,
                                user_id: user_id
                            }];
                }
            });
        });
    };
    Signin.prototype.fetchUserData = function (user_id) {
        return __awaiter(this, void 0, void 0, function () {
            var fail_reason, pass_fail, email, username, image, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fail_reason = "";
                        pass_fail = true;
                        email = "";
                        username = "";
                        image = "";
                        return [4 /*yield*/, init_1.db.query("SELECT * FROM users WHERE userID=?;", [user_id])];
                    case 1:
                        data = _a.sent();
                        if (data[0].length < 1) {
                            pass_fail = false;
                            fail_reason = "No records were found for that user ID.";
                        }
                        else {
                            email = data[0][0].email;
                            username = data[0][0].username;
                            image = data[0][0].image;
                        }
                        // If all else is good, return result
                        return [2 /*return*/, {
                                validated: pass_fail,
                                reason: fail_reason,
                                username: username,
                                email: email,
                                image: image
                            }];
                }
            });
        });
    };
    Signin.prototype.validatePassword = function (password, login_type, login) {
        return __awaiter(this, void 0, void 0, function () {
            var fail_reason, pass_fail, hashed_pass, data, passwords_match;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fail_reason = "";
                        pass_fail = true;
                        hashed_pass = "";
                        return [4 /*yield*/, init_1.db.query("SELECT password FROM users WHERE ".concat(login_type, "=?;"), [login])];
                    case 1:
                        data = _a.sent();
                        if (data[0].length < 1) {
                            pass_fail = false;
                            fail_reason = "No records were found for that login.";
                        }
                        else {
                            hashed_pass = data[0][0].password;
                        }
                        if (!(pass_fail !== false)) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, passHash_1.passMatch)(password, hashed_pass)];
                    case 2:
                        passwords_match = _a.sent();
                        if (!passwords_match) {
                            pass_fail = false;
                            fail_reason = "The entered password is incorrect. Please try again.";
                        }
                        _a.label = 3;
                    case 3: 
                    // If all else is good, return result
                    return [2 /*return*/, {
                            validated: pass_fail,
                            reason: fail_reason
                        }];
                }
            });
        });
    };
    Signin.prototype.validateLogin = function (login) {
        return __awaiter(this, void 0, void 0, function () {
            var fail_reason, pass_fail, login_type, exists_as_username, exists_as_email;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fail_reason = "";
                        pass_fail = true;
                        login_type = "";
                        return [4 /*yield*/, this.recordInUsersExists("username", login)];
                    case 1:
                        exists_as_username = _a.sent();
                        if (exists_as_username !== true) {
                            pass_fail = false;
                            fail_reason = "'".concat(login, "' is not a valid login.");
                        }
                        else if (exists_as_username === true) {
                            login_type = "username";
                        }
                        if (!(pass_fail === false)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.recordInUsersExists("email", login)];
                    case 2:
                        exists_as_email = _a.sent();
                        if (exists_as_email !== true) {
                            pass_fail = false;
                            fail_reason = "'".concat(login, "' is not a valid login.");
                        }
                        else if (exists_as_email === true) {
                            login_type = "email";
                        }
                        _a.label = 3;
                    case 3: 
                    // If all else is good, return result
                    return [2 /*return*/, {
                            validated: pass_fail,
                            reason: fail_reason,
                            login_type: login_type
                        }];
                }
            });
        });
    };
    Signin.prototype.recordInUsersExists = function (colString, value) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, init_1.db.query("SELECT * FROM users WHERE ".concat(colString, "=?;"), [value])];
                    case 1:
                        result = _a.sent();
                        result = result[0];
                        if (result.length < 1) {
                            return [2 /*return*/, false];
                        }
                        else {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Signin;
}());
exports.Signin = Signin;
