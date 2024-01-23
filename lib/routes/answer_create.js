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
exports.CreateAnswer = void 0;
var filesystem_1 = require("../uploading/filesystem");
var path = require("path");
var init_1 = require("../database/init");
var md5_1 = require("../system/md5");
var bad_words_1 = require("../filters/bad_words");
var _32_char_gen_1 = require("../system/32_char_gen");
var relPath_1 = require("../system/relPath");
/*
Types:
0 = Question
1 = General
2 = informative
3 = observation
4 = nuptial_flight
*/
var CreateAnswer = /** @class */ (function () {
    function CreateAnswer(handler) {
        this.__ok = 200;
        this.__bad_request = 400;
        // Dynamic
        this.answer_id = "";
        this.post_type = null;
        this.handler = handler;
    }
    CreateAnswer.prototype.processData = function () {
        var _this = this;
        // Initialize status
        var fail_reason = "";
        var pass_fail = true;
        // Handle the request
        this.handler._res("/answer_create", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var data, files, body, user_id, joined, for_post_id, create_check, create_successful, create_fail_reason, uploaded_images, _i, _a, _b, key, subObject, file, image_check, image_successful, image_fail_reason, image_update_check, image_update_successful, image_update_fail_reason, reply_data;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        data = req.fields;
                        files = req.files;
                        // Get always-existing data
                        console.log(data);
                        body = (0, bad_words_1.replaceBadWords)(data.body);
                        user_id = data.user_id;
                        joined = parseInt(data.joined);
                        for_post_id = data.for_post_id;
                        return [4 /*yield*/, this.createAnswer(body, user_id, joined, for_post_id)];
                    case 1:
                        create_check = _c.sent();
                        create_successful = create_check.validated;
                        create_fail_reason = create_check.reason;
                        if (!create_successful) {
                            pass_fail = false;
                            fail_reason = create_fail_reason;
                        }
                        uploaded_images = [];
                        if (!(pass_fail !== false)) return [3 /*break*/, 5];
                        _i = 0, _a = Object.entries(files);
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        _b = _a[_i], key = _b[0], subObject = _b[1];
                        // Cancel the loop if something went wrong
                        if (pass_fail !== true) {
                            return [3 /*break*/, 5];
                        }
                        file = subObject;
                        return [4 /*yield*/, this.downloadImages(file.path, file.name)];
                    case 3:
                        image_check = _c.sent();
                        image_successful = image_check.validated;
                        image_fail_reason = image_check.reason;
                        if (!image_successful) {
                            pass_fail = false;
                            fail_reason = image_fail_reason;
                        }
                        else {
                            uploaded_images.push(image_check.hashed_name); // Checks are already guaranteed that if it gets this far, 'hashed_name' is not null and will be a string.
                        }
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [4 /*yield*/, this.updateImagesColumn(uploaded_images, for_post_id)];
                    case 6:
                        image_update_check = _c.sent();
                        image_update_successful = image_update_check.validated;
                        image_update_fail_reason = image_update_check.reason;
                        if (!image_update_successful) {
                            pass_fail = false;
                            fail_reason = image_update_fail_reason;
                        }
                        if (pass_fail === false) {
                            reply_data = {
                                status: this.__bad_request,
                                message: "Failed to create answer",
                                details: fail_reason,
                                answer_id: null,
                                post_type: null
                            };
                        }
                        else if (pass_fail === true) {
                            reply_data = {
                                status: this.__ok,
                                message: "Created answer successfully",
                                details: fail_reason,
                                answer_id: this.answer_id,
                                post_type: this.post_type
                            };
                        }
                        // Reply to client
                        res.json(reply_data);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    CreateAnswer.prototype.updateImagesColumn = function (images, for_post_id) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var fail_reason, pass_fail, query_response, images_as_string, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fail_reason = "";
                        pass_fail = true;
                        images_as_string = images.join(",");
                        return [4 /*yield*/, init_1.db.query("UPDATE answers SET images=? WHERE answerID=? AND forPostID=?;", [images_as_string, this.answer_id, for_post_id])];
                    case 1:
                        // Insert into database
                        query_response = _b.sent();
                        data = (_a = query_response[0]) !== null && _a !== void 0 ? _a : undefined;
                        if (data.serverStatus !== 2) {
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
    CreateAnswer.prototype.downloadImages = function (tmp_path, file_name) {
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
                        download_path = path.join((0, relPath_1.getPathRelativeToRoot)("user_uploads/answers"), hashed_name);
                        // Download the image & return
                        return [4 /*yield*/, (0, filesystem_1.download)(download_path, file)];
                    case 2:
                        // Download the image & return
                        _a.sent();
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
    CreateAnswer.prototype.createAnswer = function (body, userID, joined, for_post_id) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var fail_reason, pass_fail, query_response, answer_id, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fail_reason = "";
                        pass_fail = true;
                        answer_id = (0, _32_char_gen_1.gen_rand_string)();
                        // Set post ID & post type
                        this.answer_id = answer_id;
                        return [4 /*yield*/, init_1.db.query("INSERT INTO answers (forPostID, answerID, userID, body, `time`) VALUES (?, ?, ?, ?, ?);", [for_post_id, answer_id, userID, body, joined])];
                    case 1:
                        // Send to database. Images will be sent AFTER this method/function completes successfully.
                        query_response = _b.sent();
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
    return CreateAnswer;
}());
exports.CreateAnswer = CreateAnswer;
