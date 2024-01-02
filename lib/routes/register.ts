import {download, dirExists, fileExists} from "../uploading/filesystem";
const path = require("path");
import {hashFileName} from "../system/md5";
import {getPathRelativeToRoot} from "../system/relPath";
import {stringContainsBadWord} from "../filters/bad_words";
import {db} from "../database/init";
import {passHash} from "../system/passHash";
import {gen_rand_string} from "../system/32_chat_gen";

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

export class Register {
    // Constant
    private handler: any;
    private __ok: number = 200;
    private __bad_request: number = 400;

    // Dynamic
    private profile_image_name: string | null = null;
    private joined: number = 0;

    public constructor(handler: any) {
        this.handler = handler;
    }

    public processRegister(): void {
        // Initialize status
        let fail_reason: string = "";
        let pass_fail: boolean = true;

        // Handle the request
        this.handler._res("/register", async (req: any, res: any) => {
            // Get all data
            const data = req.fields;
            const username: string = data.user;
            const email: string = data.em;
            const pass: string = data.pass;
            const passRpt: string = data.passrpt;
            const joined: number = data.joined;
            this.joined = joined;

            // Validate username
            const username_check = await this.validateUsername(username);
            const user_valid: boolean = username_check.validated;
            const username_fail_reason: string = username_check.reason;
            if (!user_valid) {
                fail_reason = username_fail_reason;
                pass_fail = false;
            }

            // Validate email
            const email_check = await this.validateEmail(email);
            const email_valid: boolean = email_check.validated;
            const email_fail_reason: string = email_check.reason;
            if (!email_valid) {
                fail_reason = email_fail_reason;
                pass_fail = false;
            }

            // Validate passwords
            const pass_check = this.validatePassword(pass, passRpt);
            const pass_valid: boolean = pass_check.validated;
            const pass_fail_reason: string = pass_check.reason;
            if (!pass_valid) {
                fail_reason = pass_fail_reason;
                pass_fail = false;
            }

            // Download the profile image
            let hashed_image: string | null = null;
            if (req.files.profileImage.name !== "" && pass_fail !== false /* Make sure nothing failed up until this point--we don't want needless files being uploaded to server */) {
                // profileImage.name will be empty if user opted to not use a profile image
                const profile_image_download_check = await this.downloadProfileImage(req.files.profileImage.path, req.files.profileImage.name);
                const download_successful: boolean = profile_image_download_check.validated;
                const download_fail_reason: string = profile_image_download_check.reason;
                hashed_image = profile_image_download_check.hashed_name;
                if (!download_successful) {
                    fail_reason = download_fail_reason;
                    pass_fail = false;
                }
            }

            // Create the account
            if (pass_fail !== false) {
                // Again make sure nothing else failed up until this point
                const acct_check = await this.createAccount(username, email, pass, hashed_image);
                const acct_creation_successful: boolean = acct_check.validated;
                const acct_fail_reason: string = acct_check.reason;
                if (!acct_creation_successful) {
                    pass_fail = false;
                    fail_reason = acct_fail_reason;
                }
            }

            // Process data and send response
            let reply_data: any;
            if (pass_fail === false) {
                reply_data = {
                    status: this.__bad_request,
                    message: "Registration failed",
                    details: fail_reason,
                    profile_image_name: this.profile_image_name
                }
            } else if (pass_fail === true) {
                reply_data = {
                    status: this.__ok,
                    message: "Registration successful",
                    details: fail_reason,
                    profile_image_name: this.profile_image_name
                }
            }
 
            // Reply to client
            res.json(reply_data);
        });
    }

    private async createAccount(username: string, email: string, password: string, image: string | null): Promise<{validated: boolean, reason: string}> {
        let fail_reason: string = "";
        let pass_fail: boolean = true;
        let query_response: any;

        // Hash the password
        const hash_pass_data = await passHash(password);
        const pass_result: number = hash_pass_data.result;
        if (pass_result !== 2) {
            fail_reason = `Error hashing password: ${hash_pass_data.details}`;
            pass_fail = false;
        }
        const hashed_pass: string = hash_pass_data.details;

        // Generate user_id
        const user_id: string = gen_rand_string();

        // Create the account/send to database
        if (image !== null && pass_fail !== false) { // Make sure pass/fail didn't fail on password hashing
            query_response = await db.query("INSERT INTO users (userID, username, email, password, image, joined) VALUES (?, ?, ?, ?, ?, ?);", [user_id, username, email, hashed_pass, "http://127.0.0.1:81/files/" + image, this.joined]);
        } else if (pass_fail !== false) { // Make sure pass/fail didn't fail on password hashing
            query_response = await db.query("INSERT INTO users (userID, username, email, password, joined) VALUES (?, ?, ?, ?, ?);", [user_id, username, email, hashed_pass, this.joined]);
        }

        // Get response data
        const data = query_response[0];
        if (data.serverStatus !== 2) {
            // If request failed in any way
            fail_reason = `Query failed: ${{server_status: data.serverStatus, details: data.info, warning_status: data.warningStatus}}`;
            pass_fail = false;
        }

        // If all else is good, return result
        return {
            validated: pass_fail,
            reason: fail_reason
        }
    }

    private validatePassword(password: string, passwordRpt: string): {validated: boolean, reason: string} {
        let fail_reason: string = "";
        let pass_fail: boolean = true;

        // Check that passwords match
        if (password !== passwordRpt) {
            fail_reason = "Your passwords do not match.";
            pass_fail = false;
        }
        // Validation
        let regex: RegExp;
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
        const special_char_count: number = (password.match(regex) || []).length;
        if (special_char_count < 2) {
            fail_reason = `Your password must contain at least 2 special characters, you only have ${special_char_count}.`;
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
            }
        } else {
            return {
                validated: pass_fail,
                reason: ""
            }
        }
    }

    private async validateEmail(email: string): Promise<{validated: boolean, reason: string}> {
        let fail_reason: string = "";
        let pass_fail: boolean = true;

        // Validate email address format
        const regex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            fail_reason = "Your email address is not in a valid format.";
            pass_fail = false;
        }
        const email_exists: boolean = await this.recordInUsersDoesNotExist("email", email);
        if (email_exists !== true) {
            pass_fail = false;
            fail_reason = `The email '${email}' is already in use.`;
        }

        // If all else is good, return result
        if (pass_fail === false) {
            return {
                validated: pass_fail,
                reason: fail_reason
            }
        } else {
            return {
                validated: pass_fail,
                reason: ""
            }
        }
    }

    private async validateUsername(username: string): Promise<{validated: boolean, reason: string}> {
        let fail_reason: string = "";
        let pass_fail: boolean = true;

        // Check that username is alphanumeric
        const regex: RegExp = /^[a-zA-Z0-9]+$/;
        if (!regex.test(username)) {
            fail_reason = "Your username must be alphanumeric [a-Z] - [0-9].";
            pass_fail = false;
        }
        // Check that username is minimum length of 5
        if (username.length < 5) {
            fail_reason = "Your username must be at least 5 characters long.";
            pass_fail = false;
        }
        // Check that username doesn't have bad words
        const bad_word_check = stringContainsBadWord(username);
        const has_bad_word: boolean = bad_word_check.has_bad_word;
        if (has_bad_word) {
            // Return false, and set this data as props
            const bad_word: string | undefined = bad_word_check.found_bad_word;
            fail_reason = `Your username contains a bad word: '${bad_word}'`;
            pass_fail = false;
        }
        const username_exists: boolean = await this.recordInUsersDoesNotExist("username", username);
        if (username_exists !== true) {
            pass_fail = false;
            fail_reason = `The username '${username}' is already in use.`;
        }

        // If all else is good, return result
        if (pass_fail === false) {
            return {
                validated: pass_fail,
                reason: fail_reason
            }
        } else {
            return {
                validated: pass_fail,
                reason: ""
            }
        }
    }

    private async downloadProfileImage(tmp_path: string, file_name: string): Promise<{validated: boolean, reason: string, hashed_name: string | null}> {
        let fail_reason: string = "";
        let pass_fail: boolean = true;

        try {
            // Check file path format
            const file: any = path.join(tmp_path);
            // Get download path formatted
            const hashed_name: string = hashFileName(file_name);
            const download_path: string = path.join(getPathRelativeToRoot("user_uploads/profile_images"), hashed_name);
            // Download the image & return
            await download(download_path, file);
            // Set profile_image_name prop
            this.profile_image_name = hashed_name;
            // Return
            return {
                validated: pass_fail,
                reason: "",
                hashed_name: hashed_name
            }
        } catch (error) {
            const reason: string = `Error downloading profile image: ${error}`;
            console.error(reason);
            return {
                validated: false,
                reason: reason,
                hashed_name: null
            }
        }
    }

    private async recordInUsersDoesNotExist(colString: string, value: string): Promise<boolean> {
        let result: any = await db.query(`SELECT * FROM users WHERE ${colString}=?;`, [value]);
        result = result[0];
        if (result.length < 1) {
            return true;
        } else {
            return false;
        }
    }
}