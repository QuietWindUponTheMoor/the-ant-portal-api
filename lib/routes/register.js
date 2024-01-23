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
exports.Register = void 0;
var filesystem_1 = require("../uploading/filesystem");
var path = require("path");
var md5_1 = require("../system/md5");
var relPath_1 = require("../system/relPath");
var bad_words_1 = require("../filters/bad_words");
var init_1 = require("../database/init");
var passHash_1 = require("../system/passHash");
var _32_char_gen_1 = require("../system/32_char_gen");
/*
Account creation rules:
1. Usernames must be alphanumeric and at least 5 in length. They must also be appropriate.
2. Email addresses must be valid
3. Passwords must be at least 8 characters long and contain a special character and a number
    Password must also contain:
    A. Must contain at least one uppercase letter and one lowercase letter
    B. Must contain at least 1 number/digit
    C. Must have at least 2 special characters, even if those characters are the same/repeated (for example: **)
    D. Special characters that count: !@#$%^&*()_+{}\[\]:;<>,.?~\\/-
*/
var Register = /** @class */ (function () {
    function Register(handler) {
        this.__ok = 200;
        this.__bad_request = 400;
        // Dynamic
        this.profile_image_name = null;
        this.joined = 0;
        this.handler = handler;
    }
    Register.prototype.processRegister = function () {
        var _this = this;
        // Initialize status
        var fail_reason = "";
        var pass_fail = true;
        // Handle the request
        this.handler._res("/register", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var data, username, email, pass, passRpt, joined, username_check, user_valid, username_fail_reason, email_check, email_valid, email_fail_reason, pass_check, pass_valid, pass_fail_reason, hashed_image, profile_image_download_check, download_successful, download_fail_reason, acct_check, acct_creation_successful, acct_fail_reason, reply_data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = req.fields;
                        username = data.user;
                        email = data.em;
                        pass = data.pass;
                        passRpt = data.passrpt;
                        joined = data.joined;
                        this.joined = joined;
                        return [4 /*yield*/, this.validateUsername(username)];
                    case 1:
                        username_check = _a.sent();
                        user_valid = username_check.validated;
                        username_fail_reason = username_check.reason;
                        if (!user_valid) {
                            fail_reason = username_fail_reason;
                            pass_fail = false;
                        }
                        return [4 /*yield*/, this.validateEmail(email)];
                    case 2:
                        email_check = _a.sent();
                        email_valid = email_check.validated;
                        email_fail_reason = email_check.reason;
                        if (!email_valid) {
                            fail_reason = email_fail_reason;
                            pass_fail = false;
                        }
                        pass_check = this.validatePassword(pass, passRpt);
                        pass_valid = pass_check.validated;
                        pass_fail_reason = pass_check.reason;
                        if (!pass_valid) {
                            fail_reason = pass_fail_reason;
                            pass_fail = false;
                        }
                        hashed_image = null;
                        if (!(req.files.profileImage.name !== "" && pass_fail !== false) /* Make sure nothing failed up until this point--we don't want needless files being uploaded to server */) return [3 /*break*/, 4]; /* Make sure nothing failed up until this point--we don't want needless files being uploaded to server */
                        return [4 /*yield*/, this.downloadProfileImage(req.files.profileImage.path, req.files.profileImage.name)];
                    case 3:
                        profile_image_download_check = _a.sent();
                        download_successful = profile_image_download_check.validated;
                        download_fail_reason = profile_image_download_check.reason;
                        hashed_image = profile_image_download_check.hashed_name;
                        if (!download_successful) {
                            fail_reason = download_fail_reason;
                            pass_fail = false;
                        }
                        _a.label = 4;
                    case 4:
                        if (!(pass_fail !== false)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.createAccount(username, email, pass, hashed_image)];
                    case 5:
                        acct_check = _a.sent();
                        acct_creation_successful = acct_check.validated;
                        acct_fail_reason = acct_check.reason;
                        if (!acct_creation_successful) {
                            pass_fail = false;
                            fail_reason = acct_fail_reason;
                        }
                        _a.label = 6;
                    case 6:
                        if (pass_fail === false) {
                            reply_data = {
                                status: this.__bad_request,
                                message: "Registration failed",
                                details: fail_reason,
                                profile_image_name: this.profile_image_name
                            };
                        }
                        else if (pass_fail === true) {
                            reply_data = {
                                status: this.__ok,
                                message: "Registration successful",
                                details: fail_reason,
                                profile_image_name: this.profile_image_name
                            };
                        }
                        // Reply to client
                        res.json(reply_data);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Register.prototype.createAccount = function (username, email, password, image) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var fail_reason, pass_fail, query_response, hash_pass_data, pass_result, hashed_pass, user_id, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fail_reason = "";
                        pass_fail = true;
                        return [4 /*yield*/, (0, passHash_1.passHash)(password)];
                    case 1:
                        hash_pass_data = _b.sent();
                        pass_result = hash_pass_data.result;
                        if (pass_result !== 2) {
                            fail_reason = "Error hashing password: ".concat(hash_pass_data.details);
                            pass_fail = false;
                        }
                        hashed_pass = hash_pass_data.details;
                        user_id = (0, _32_char_gen_1.gen_rand_string)();
                        if (!(image !== null && pass_fail !== false)) return [3 /*break*/, 3];
                        return [4 /*yield*/, init_1.db.query("INSERT INTO users (userID, username, email, password, image, joined) VALUES (?, ?, ?, ?, ?, ?);", [user_id, username, email, hashed_pass, "http://127.0.0.1:81/files/" + image, this.joined])];
                    case 2:
                        query_response = _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        if (!(pass_fail !== false)) return [3 /*break*/, 5];
                        return [4 /*yield*/, init_1.db.query("INSERT INTO users (userID, username, email, password, joined) VALUES (?, ?, ?, ?, ?);", [user_id, username, email, hashed_pass, this.joined])];
                    case 4:
                        query_response = _b.sent();
                        _b.label = 5;
                    case 5:
                        data = (_a = query_response[0]) !== null && _a !== void 0 ? _a : undefined;
                        if (data === undefined || data.serverStatus !== 2) {
                            // If request failed in any way
                            fail_reason = "Query failed: ".concat({ server_status: data.serverStatus, details: data.info, warning_status: data.warningStatus });
                            pass_fail = false;
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
    Register.prototype.validatePassword = function (password, passwordRpt) {
        var fail_reason = "";
        var pass_fail = true;
        // Check that passwords match
        if (password !== passwordRpt) {
            fail_reason = "Your passwords do not match.";
            pass_fail = false;
        }
        // Validation
        var regex;
        // Validate password
        regex = /[A-Z]/;
        if (!regex.test(password)) {
            fail_reason = "Your password must contain at least one uppercase letter [A-Z].";
            pass_fail = false;
        }
        regex = /[a-z]/;
        if (!regex.test(password)) {
            fail_reason = "Your password must contain at least one lowercase letter [a-z].";
            pass_fail = false;
        }
        regex = /\d/;
        if (!regex.test(password)) {
            fail_reason = "Your password must contain at least one number [0-9].";
            pass_fail = false;
        }
        regex = /([!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).*\1/;
        if (!regex.test(password)) {
            fail_reason = "Your password must contain special characters.";
            pass_fail = false;
        }
        regex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/g;
        var special_char_count = (password.match(regex) || []).length;
        if (special_char_count < 2) {
            fail_reason = "Your password must contain at least 2 special characters, you only have ".concat(special_char_count, ".");
            pass_fail = false;
        }
        // Check that password is at least 8 characters long
        if (password.length < 8) {
            fail_reason = "Your password must be at least 8 characters long.";
            pass_fail = false;
        }
        // If all else is good, return result
        if (pass_fail === false) {
            return {
                validated: pass_fail,
                reason: fail_reason
            };
        }
        else {
            return {
                validated: pass_fail,
                reason: ""
            };
        }
    };
    Register.prototype.validateEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var fail_reason, pass_fail, regex, email_exists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fail_reason = "";
                        pass_fail = true;
                        regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!regex.test(email)) {
                            fail_reason = "Your email address is not in a valid format.";
                            pass_fail = false;
                        }
                        return [4 /*yield*/, this.recordInUsersDoesNotExist("email", email)];
                    case 1:
                        email_exists = _a.sent();
                        if (email_exists !== true) {
                            pass_fail = false;
                            fail_reason = "The email '".concat(email, "' is already in use.");
                        }
                        // If all else is good, return result
                        if (pass_fail === false) {
                            return [2 /*return*/, {
                                    validated: pass_fail,
                                    reason: fail_reason
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    validated: pass_fail,
                                    reason: ""
                                }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Register.prototype.validateUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var fail_reason, pass_fail, regex, bad_word_check, has_bad_word, bad_word, username_exists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fail_reason = "";
                        pass_fail = true;
                        regex = /^[a-zA-Z0-9]+$/;
                        if (!regex.test(username)) {
                            fail_reason = "Your username must be alphanumeric [a-Z] - [0-9].";
                            pass_fail = false;
                        }
                        // Check that username is minimum length of 5
                        if (username.length < 5) {
                            fail_reason = "Your username must be at least 5 characters long.";
                            pass_fail = false;
                        }
                        bad_word_check = (0, bad_words_1.stringContainsBadWord)(username);
                        has_bad_word = bad_word_check.has_bad_word;
                        if (has_bad_word) {
                            bad_word = bad_word_check.found_bad_word;
                            fail_reason = "Your username contains a bad word: '".concat(bad_word, "'");
                            pass_fail = false;
                        }
                        return [4 /*yield*/, this.recordInUsersDoesNotExist("username", username)];
                    case 1:
                        username_exists = _a.sent();
                        if (username_exists !== true) {
                            pass_fail = false;
                            fail_reason = "The username '".concat(username, "' is already in use.");
                        }
                        // If all else is good, return result
                        if (pass_fail === false) {
                            return [2 /*return*/, {
                                    validated: pass_fail,
                                    reason: fail_reason
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    validated: pass_fail,
                                    reason: ""
                                }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Register.prototype.downloadProfileImage = function (tmp_path, file_name) {
        return __awaiter(this, void 0, void 0, function () {
            var fail_reason, pass_fail, file, hashed_name, download_path, error_1, reason;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fail_reason = "";
                        pass_fail = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        file = path.join(tmp_path);
                        hashed_name = (0, md5_1.hashFileName)(file_name);
                        download_path = path.join((0, relPath_1.getPathRelativeToRoot)("user_uploads/profile_images"), hashed_name);
                        // Download the image & return
                        return [4 /*yield*/, (0, filesystem_1.download)(download_path, file)];
                    case 2:
                        // Download the image & return
                        _a.sent();
                        // Set profile_image_name prop
                        this.profile_image_name = hashed_name;
                        // Return
                        return [2 /*return*/, {
                                validated: pass_fail,
                                reason: "",
                                hashed_name: hashed_name
                            }];
                    case 3:
                        error_1 = _a.sent();
                        reason = "Error downloading profile image: ".concat(error_1);
                        console.error(reason);
                        return [2 /*return*/, {
                                validated: false,
                                reason: reason,
                                hashed_name: null
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Register.prototype.recordInUsersDoesNotExist = function (colString, value) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, init_1.db.query("SELECT * FROM users WHERE ".concat(colString, "=?;"), [value])];
                    case 1:
                        result = _a.sent();
                        result = result[0];
                        if (result.length < 1) {
                            return [2 /*return*/, true];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Register;
}());
exports.Register = Register;
