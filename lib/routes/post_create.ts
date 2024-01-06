import {download, dirExists, fileExists} from "../uploading/filesystem";
const path = require("path");
import {db} from "../database/init";
import {hashFileName} from "../system/md5";
import {replaceBadWords} from "../filters/bad_words";
import {gen_rand_string} from "../system/32_char_gen";
import {getPathRelativeToRoot} from "../system/relPath";

/*
Types:
0 = Question
1 = General
2 = informative
3 = observation
4 = nuptial_flight
*/

export class CreatePost {
    // Constant
    private handler: any;
    private __ok: number = 200;
    private __bad_request: number = 400;

    // Dynamic
    private post_id: string = "";
    private post_type: number | null = null;

    public constructor(handler: any) {
        this.handler = handler;
    }

    public processData(): void {
        // Initialize status
        let fail_reason: string = "";
        let pass_fail: boolean = true;

        // Handle the request
        this.handler._res("/post_create", async (req: any, res: any) => {
            // Get all data
            const data = req.fields;
            const files = req.files;

            // Get always-existing data
            const type: number = parseInt(data.post_type);
            const title: string = replaceBadWords(data.species ?? data.title);
            const body: string = replaceBadWords(data.body);
            const user_id: string = data.user_id;
            const joined: number = parseInt(data.joined);
            const tags: string = replaceBadWords(data.all_tags);

            // Get type-dependant data
            const latitude: string | null = data.latitude ?? null;
            const longitude: string | null = data.longitude ?? null;
            let temperature: number | null = parseInt(data.temperature) ?? null;
            let wind_speed: number | null = parseInt(data.wind_speed) ?? null;
            let moon_cycle: number | null = parseInt(data.moon_cycle) ?? null;
            if (Number.isNaN(temperature)) {
                temperature = null;
            }
            if (Number.isNaN(wind_speed)) {
                wind_speed = null;
            }
            if (Number.isNaN(moon_cycle)) {
                moon_cycle = null;
            }

            // Send data to the database
            const create_check = await this.createPost(type, title, body, user_id, joined, latitude, longitude, temperature, wind_speed, moon_cycle, tags);
            const create_successful: boolean = create_check.validated;
            const create_fail_reason: string = create_check.reason;
            if (!create_successful) {
                pass_fail = false;
                fail_reason = create_fail_reason;
            }

            // Upload images/files ONLY if everything is successful up until this point
            let uploaded_images: Array<string> = [];
            if (pass_fail !== false) {
                // Count the number of files sent by client
                //const file_count: number = Object.keys(files).length;
                
                for (const [key, subObject] of Object.entries(files)) {
                    // Cancel the loop if something went wrong
                    if (pass_fail !== true) {
                        break;
                    }

                    // Standardize the file
                    const file: any = subObject;

                    // Download the file to the server
                    const image_check = await this.downloadImages(file.path, file.name);
                    const image_successful: boolean = image_check.validated;
                    const image_fail_reason: string = image_check.reason;
                    if (!image_successful) {
                        pass_fail = false;
                        fail_reason = image_fail_reason;
                    } else {
                        uploaded_images.push(image_check.hashed_name!); // Checks are already guaranteed that if it gets this far, 'hashed_name' is not null and will be a string.
                    }
                }
            }

            // If everything has been successful until now, update the 'images' value of the post
            const image_update_check = await this.updateImagesColumn(uploaded_images);
            const image_update_successful: boolean = image_update_check.validated;
            const image_update_fail_reason: string = image_update_check.reason;
            if (!image_update_successful) {
                pass_fail = false;
                fail_reason = image_update_fail_reason;
            }

            // Process data and send response
            let reply_data: any;
            if (pass_fail === false) {
                reply_data = {
                    status: this.__bad_request,
                    message: "Failed to create post",
                    details: fail_reason,
                    post_id: null,
                    post_type: null
                }
            } else if (pass_fail === true) {
                reply_data = {
                    status: this.__ok,
                    message: "Created post successfully",
                    details: fail_reason,
                    post_id: this.post_id,
                    post_type: this.post_type
                }
            }
 
            // Reply to client
            res.json(reply_data);
        });
    }

    private async updateImagesColumn(images: Array<string>): Promise<{validated: boolean, reason: string}> {
        let fail_reason: string = "";
        let pass_fail: boolean = true;
        let query_response: any;

        // Convert array to string
        const images_as_string: string = images.join(",");
        
        // Insert into database
        query_response = await db.query("UPDATE posts SET images=? WHERE postID=?;", [images_as_string, this.post_id]);

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

    private async downloadImages(tmp_path: string, file_name: string): Promise<{validated: boolean, reason: string, hashed_name: string | null}> {
        let fail_reason: string = "";
        let pass_fail: boolean = true;

        try {
            // Check file path format
            const file: any = path.join(tmp_path);
            // Get download path formatted
            const hashed_name: string = hashFileName(file_name);
            const download_path: string = path.join(getPathRelativeToRoot("user_uploads/posts"), hashed_name);
            // Download the image & return
            await download(download_path, file);
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

    private async createPost(
        type: number,
        title: string,
        body: string,
        userID: string,
        joined: number,
        latitude: string | null,
        longitude: string | null,
        temperature: number | null,
        wind_speed: number | null,
        moon_cycle: number | null,
        tags: string,
    ): Promise<{validated: boolean, reason: string}> {
        let fail_reason: string = "";
        let pass_fail: boolean = true;
        let query_response: any;

        // Generate random post ID
        const post_id: string = gen_rand_string();

        // Set post ID & post type
        this.post_id = post_id;
        this.post_type = type;

        // Send to database. Images will be sent AFTER this method/function completes successfully.
        query_response = await db.query("INSERT INTO posts (postID, userID, `type`, title, body, `time`, lat, `long`, species, temperature, wind_speed, moon_cycle, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [post_id, userID, type, title, body, joined, latitude, longitude, title, temperature, wind_speed, moon_cycle, tags]);

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
}