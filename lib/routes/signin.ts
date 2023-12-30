import {db} from "../database/init";
import {passMatch} from "../system/passHash";

export class Signin {
    // Constant
    private handler: any;
    private __ok: number = 200;
    private __bad_request: number = 400;

    public constructor(handler: any) {
        this.handler = handler;
    }

    public processRegister(): void {
        // Initialize status
        let fail_reason: string = "";
        let pass_fail: boolean = true;

        // Handle the request
        this.handler._res("/signin", async (req: any, res: any) => {
            // Get all data
            const data = req.fields;
            const login: string = data.login;
            const pass: string = data.pass;

            // Validate login
            const login_check = await this.validateLogin(login);
            const login_valid: boolean = login_check.validated;
            const login_fail_reason: string = login_check.reason;
            const login_type: string = login_check.login_type;
            if (!login_valid) {
                pass_fail = false;
                fail_reason = login_fail_reason;
            }
            
            // Validate password only if login was valid
            if (pass_fail !== false) {
                const pass_check = await this.validatePassword(pass, login_type, login);
                const pass_valid: boolean = pass_check.validated;
                const pass_fail_reason: string = pass_check.reason;
                if (!pass_valid) {
                    pass_fail = false;
                    fail_reason = pass_fail_reason;
                }
            }

            // Get userID only if all else was valid
            let user_id: number = 0;
            if (pass_fail !== false) {
                const id_fetch = await this.fetchUserID(login_type, login);
                const id_valid: boolean = id_fetch.validated;
                const id_fail_reason: string = id_fetch.reason;
                user_id = id_fetch.user_id;
                if (!id_valid) {
                    pass_fail = false;
                    fail_reason = id_fail_reason;
                }
            }

            // Set session data only if all else was valid
            if (pass_fail !== false) {
                const login_fetch = await this.__login(req, user_id);
                const login_valid: boolean = login_fetch.validated;
                const login_fail_reason: string = login_fetch.reason;
                if (!login_valid) {
                    pass_fail = false;
                    fail_reason = login_fail_reason;
                }
            }

            // Process data and send response
            let reply_data: any;
            if (pass_fail === false) {
                reply_data = {
                    status: this.__bad_request,
                    message: "Signin failed",
                    details: fail_reason,
                    user_data: null
                }
            } else if (pass_fail === true) {
                reply_data = {
                    status: this.__ok,
                    message: "Signin successful",
                    details: fail_reason,
                    user_data: req.session.user
                }
            }
 
            // Reply to client
            res.json(reply_data);
        });
    }

    private async __login(req: any, user_id: number): Promise<{validated: boolean, reason: string}> {
        let fail_reason: string = "";
        let pass_fail: boolean = true;

        // Get email and username
        const user_data = await this.fetchUserData(user_id);
        const user_data_valid: boolean = user_data.validated;
        const user_data_fail_reason: string = user_data.reason;
        const email: string = user_data.email;
        const username: string = user_data.username;
        const image: string = user_data.image;
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
                image: "http://127.0.0.1:81/files/" + encodeURIComponent(image)
            };
        }

        // If all else is good, return result
        return {
            validated: pass_fail,
            reason: fail_reason
        }
    }

    private async fetchUserID(login_type: string, login: string): Promise<{validated: boolean, reason: string, user_id: number}> {
        let fail_reason: string = "";
        let pass_fail: boolean = true;
        let user_id: number = 0;

        // Fetch user ID
        const data: any = await db.query(`SELECT userID FROM users WHERE ${login_type}=?;`, [login]);
        if (data[0].length < 1) {
            pass_fail = false;
            fail_reason = "No records were found for that login.";
        } else {
            user_id = data[0][0].userID;
        }

        // If all else is good, return result
        return {
            validated: pass_fail,
            reason: fail_reason,
            user_id: user_id
        }
    }

    private async fetchUserData(user_id: number): Promise<{validated: boolean, reason: string, username: string, email: string, image: string}> {
        let fail_reason: string = "";
        let pass_fail: boolean = true;
        let email: string = "";
        let username: string = "";
        let image: string = "";

        // Fetch user ID
        const data: any = await db.query(`SELECT * FROM users WHERE userID=?;`, [user_id]);
        if (data[0].length < 1) {
            pass_fail = false;
            fail_reason = "No records were found for that user ID.";
        } else {
            email = data[0][0].email;
            username = data[0][0].username;
            image = data[0][0].image;
        }

        // If all else is good, return result
        return {
            validated: pass_fail,
            reason: fail_reason,
            username: username,
            email: email,
            image: image
        }
    }

    private async validatePassword(password: string, login_type: string, login: string): Promise<{validated: boolean, reason: string}> {
        let fail_reason: string = "";
        let pass_fail: boolean = true;
        let hashed_pass: string = "";

        // Get hashed password
        let data: any = await db.query(`SELECT password FROM users WHERE ${login_type}=?;`, [login]);
        if (data[0].length < 1) {
            pass_fail = false;
            fail_reason = "No records were found for that login.";
        } else {
            hashed_pass = data[0][0].password;
        }

        // Check that password matches database record
        if (pass_fail !== false) {
            const passwords_match: boolean = await passMatch(password, hashed_pass);
            if (!passwords_match) {
                pass_fail = false;
                fail_reason = "The entered password is incorrect. Please try again.";
            }
        }

        // If all else is good, return result
        return {
            validated: pass_fail,
            reason: fail_reason
        }
    }

    private async validateLogin(login: string): Promise<{validated: boolean, reason: string, login_type: string}> {
        let fail_reason: string = "";
        let pass_fail: boolean = true;
        let login_type: string = "";

        // Check if login matches a username
        const exists_as_username: boolean = await this.recordInUsersExists("username", login);
        if (exists_as_username !== true) {
            pass_fail = false;
            fail_reason = `'${login}' is not a valid login.`;
        } else if (exists_as_username === true) {
            login_type = "username";
        }

        // Check if login matches an email instead
        if (pass_fail === false) { // Only check if the login wasn't a username, meaning it can now only be valid as an email instead
            const exists_as_email: boolean = await this.recordInUsersExists("email", login);
            if (exists_as_email !== true) {
                pass_fail = false;
                fail_reason = `'${login}' is not a valid login.`;
            } else if (exists_as_email === true) {
                login_type = "email";
            }
        }

        // If all else is good, return result
        return {
            validated: pass_fail,
            reason: fail_reason,
            login_type: login_type
        }
    }

    private async recordInUsersExists(colString: string, value: string): Promise<boolean> {
        let result: any = await db.query(`SELECT * FROM users WHERE ${colString}=?;`, [value]);
        result = result[0];
        if (result.length < 1) {
            return false;
        } else {
            return true;
        }
    }
}