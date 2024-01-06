import {db} from "../database/init";

export class PostData {
    // Constant
    private handler: any;
    private __ok: number = 200;
    private __bad_request: number = 400;

    public constructor(handler: any) {
        this.handler = handler;
    }

    public processPostData(): void {
        // Initialize status
        let fail_reason: string = "";
        let pass_fail: boolean = true;

        // Handle the request
        this.handler._res("/fetch_post_data", async (req: any, res: any) => {
            // Initialize post_data
            let post_data: any = null;
            // Get all data
            const data = req.fields;
            const login_status: number = parseInt(data.login_status);
            const post_id: string = data.post_id;

            // Log the login status of the user
            console.log(`User tried fetching post data with login_status ${login_status}`);

            if (login_status !== 200) {
                // Client is not logged in
                pass_fail = false;
                fail_reason = "The user is not logged in.";
            } else if (post_id === null) {
                // Post ID is not valid
                pass_fail = false;
                fail_reason = `The post id ${post_id} is not valid.`;
            } else {
                // Everything is OK
                const fetch_check: any = await this.fetchPostData(post_id);
                const fetch_successful: boolean = fetch_check.validated;
                const fetch_fail_reason: string = fetch_check.reason;
                post_data = fetch_check.post_data;
                if (!fetch_successful) {
                    pass_fail = false;
                    fail_reason = fetch_fail_reason;
                }
            }

            // Process data and send response
            let reply_data: any;
            if (pass_fail === false || post_data === null) {
                reply_data = {
                    status: this.__bad_request,
                    message: "Fetch data failed",
                    details: fail_reason,
                    post_data: null
                }
            } else if (pass_fail === true) {
                reply_data = {
                    status: this.__ok,
                    message: "Fetched data successfully",
                    details: fail_reason,
                    post_data: post_data
                }
            }

            // Log reply data
            if (pass_fail === false) {
                console.error(reply_data);
            } else {
                console.log({
                    status: this.__ok,
                    message: "Fetched data successfully",
                    details: fail_reason
                });
            }
 
            // Reply to client
            res.json(reply_data);
        });
    }

    public async fetchPostData(post_id: string): Promise<{validated: boolean, reason: string, post_data: any}> {
        let fail_reason: string = "";
        let pass_fail: boolean = true;
        let post_data: any;
        
        // Fetch data
        const data: any = await db.query(`SELECT * FROM posts WHERE postID=?;`, [post_id]);
        if (data[0].length < 1) {
            pass_fail = false;
            fail_reason = "No records were found for that user ID.";
            post_data = null;
        } else {
            post_data = data[0][0];
        }

        // If all else is good, return result
        return {
            validated: pass_fail,
            reason: fail_reason,
            post_data: post_data
        }
    }
}