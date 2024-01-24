import { query } from "express";
import {db} from "../database/init";

export class ManualQuery {
    // Constant
    private handler: any;
    private __ok: number = 200;
    private __bad_request: number = 400;

    public constructor(handler: any) {
        this.handler = handler;
    }

    listen(): void {
        // Initialize status
        let fail_reason: string = "";
        let pass_fail: boolean = true;

        // Handle the request
        this.handler._res("/manual_queries", async (req: any, res: any) => {
            // Get all data
            const req_data = req.fields;
            const query: string = req_data.query;
            const input_data: Array<any> = JSON.parse(req_data.data);

            // Initialize query_response
            let query_response: any = null;

            // Run the query
            query_response = await db.query(query, input_data);
            const query_data: any = query_response[0][0];
            let send_data: any = "";
            if (query_data === undefined) {
                send_data = null;
            } else {
                send_data = query_data;
            }

            // For replies
            if (query === "SELECT * FROM replies WHERE `type`=? AND forItemID=? ORDER BY `time` ASC;") {
                if (query_data === undefined) {
                    send_data = null;
                } else {
                    send_data = query_response[0];
                }
            }

            // Process data and send response
            let reply_data: any;
            reply_data = {
                status: this.__ok,
                message: "Query ran successfully",
                data: send_data 
            };

            // Reply to client
            res.json(reply_data);
        });
    }
}