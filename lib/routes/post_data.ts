import { query } from "express";
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
            let answers_data: any = null;
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
                // Everything is OK now fetch post data
                const fetch_check: any = await this.fetchPostData(post_id);
                const fetch_successful: boolean = fetch_check.validated;
                const fetch_fail_reason: string = fetch_check.reason;
                post_data = fetch_check.post_data;
                if (!fetch_successful) {
                    pass_fail = false;
                    fail_reason = fetch_fail_reason;
                }

                // Everything is OK now fetch answers for this post
                const answers_check: any = await this.fetchAnswersData(post_id);
                const answers_successful: boolean = answers_check.validated;
                const answers_fail_reason: string = answers_check.reason;
                answers_data = answers_check.answer_data;
                if (!answers_successful) {
                    pass_fail = false;
                    fail_reason = answers_fail_reason;
                }
            }

            // If everything else to this point is good, increment view count
            const increment_check: any = await this.incrementViewCount(post_id);
            const increment_successful: boolean = increment_check.validated;
            const increment_fail_reason: string = increment_check.reason;
            if (!increment_successful) {
                pass_fail = false;
                fail_reason = increment_fail_reason;
            }

            // Process data and send response
            let reply_data: any;
            if (pass_fail === false || post_data === null) {
                reply_data = {
                    status: this.__bad_request,
                    message: "Fetch data failed",
                    details: fail_reason,
                    post_data: null,
                    answers: null
                }
            } else if (pass_fail === true) {
                reply_data = {
                    status: this.__ok,
                    message: "Fetched data successfully",
                    details: fail_reason,
                    post_data: post_data,
                    answers: answers_data
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

    public async incrementViewCount(post_id: string): Promise<{validated: boolean, reason: string, post_data: any}> {
        let fail_reason: string = "";
        let pass_fail: boolean = true;
        let post_data: any;
        let view_count: number = 0;
        let query_response: any = null;
        
        // Fetch current view count
        const data: any = await db.query(`SELECT views FROM posts WHERE postID=?;`, [post_id]);
        if (data[0].length < 1) {
            pass_fail = false;
            fail_reason = `Cannot fetch view_count for post ${post_id}.`;
            post_data = null;
        } else {
            post_data = data[0][0];
            view_count = post_data.views;
        }

        // If fetching current view count didn't fail, increment:
        if (pass_fail !== false) { // If it DID fail by now
            // Increment view count and update
            view_count++;
            query_response = await db.query("UPDATE posts SET views=? WHERE postID=?;", [view_count, post_id]);
        }

        /*
        null = post_id is invalid or post doesn't exist
        NOT NULL and [0] can be set = everything is good
        ResultSetHeader.affectedRows = 0 means item wasn't found; in this case, send a console error for failure with ResultSetHeader.info attached as fail_reason
        */

        if (query_response !== null && query_response[0] !== undefined) { // Everything was good up until now
            if (query_response[0].serverStatus !== 2) { // Query itself failed
                pass_fail = false;
                fail_reason = `Query Failed: ${query_response[0].info}`;
            } else {
                console.log(`\x1b[33m Incremented view_count for post \x1b[32m${post_id}\x1b[0m`);
            }
        }

        // If all else is good, return result
        return {
            validated: pass_fail,
            reason: fail_reason,
            post_data: post_data
        }
    }

    public async fetchPostData(post_id: string): Promise<{validated: boolean, reason: string, post_data: any}> {
        let fail_reason: string = "";
        let pass_fail: boolean = true;
        let post_data: any;
        
        // Fetch data
        const data: any = await db.query(`SELECT * FROM posts WHERE postID=?;`, [post_id]);
        if (data[0].length < 1) {
            pass_fail = false;
            fail_reason = `No records were found for the post ID ${post_id}.`;
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

    public async fetchAnswersData(post_id: string): Promise<{validated: boolean, reason: string, answer_data: any}> {
        let fail_reason: string = "";
        let pass_fail: boolean = true;
        let answer_data: any;
        
        // Fetch data
        const data: any = await db.query(`SELECT *, (upvotes - downvotes) AS total_votes, isAcceptedAnswer FROM answers WHERE forPostID=? ORDER BY isAcceptedAnswer DESC, total_votes DESC;`, [post_id]);
        if (data[0].length < 1) {
            pass_fail = false;
            fail_reason = `No records were found for the post ID ${post_id}.`;
            answer_data = null;
        } else {
            answer_data = data[0];
        }

        // If all else is good, return result
        return {
            validated: pass_fail,
            reason: fail_reason,
            answer_data: answer_data
        }
    }
}