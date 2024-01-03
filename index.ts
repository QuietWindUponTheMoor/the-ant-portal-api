// Imports
import {RequestHandler} from "./lib/requests/request_handler";
import {Register} from "./lib/routes/register";
import {Signin} from "./lib/routes/signin";
import {CreatePost} from "./lib/routes/post_create";

// Create handler class instance
const handler: RequestHandler = new RequestHandler(__dirname);
// Start the script
main();

async function main(): Promise<void> {
    // Initialize classes
    const Reg = new Register(handler);
    const Login = new Signin(handler);
    const PostCreate = new CreatePost(handler);


    // Manage registrations
    Reg.processRegister();

    // Manage signins
    Login.processRegister();
    //handler.fetchLoginSession(); // Send client user data when asked

    // Manage post creation
    PostCreate.processData();
}

// Start express
handler.startServer();