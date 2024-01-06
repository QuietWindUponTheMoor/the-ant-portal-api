// Imports
import {RequestHandler} from "./lib/requests/request_handler";
import {Register} from "./lib/routes/register";
import {Signin} from "./lib/routes/signin";
import {CreatePost} from "./lib/routes/post_create";
import {PostData} from "./lib/routes/post_data";

// Create handler class instance
const handler: RequestHandler = new RequestHandler(__dirname);

// Start the script
main();

async function main(): Promise<void> {
    // Initialize classes
    const Reg = new Register(handler);
    const Login = new Signin(handler);
    const PostCreate = new CreatePost(handler);
    const Post_Data = new PostData(handler);

    // Manage registrations
    Reg.processRegister();

    // Manage signins
    Login.processRegister();
    //handler.fetchLoginSession(); // Send client user data when asked

    // Manage post creation
    PostCreate.processData();

    // Process fetching of post data
    Post_Data.processPostData();
}

// Start express
handler.startServer();