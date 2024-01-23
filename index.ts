// Imports
import {RequestHandler} from "./lib/requests/request_handler";
import {Register} from "./lib/routes/register";
import {Signin} from "./lib/routes/signin";
import {CreatePost} from "./lib/routes/post_create";
import {CreateAnswer} from "./lib/routes/answer_create";
import {PostData} from "./lib/routes/post_data";
import {ManualQuery} from "./lib/routes/manual_queries";

// Create handler class instance
const handler: RequestHandler = new RequestHandler(__dirname);

// Start the script
main();

async function main(): Promise<void> {
    // Initialize classes
    const Reg = new Register(handler);
    const Login = new Signin(handler);
    const PostCreate = new CreatePost(handler);
    const AnswerCreate = new CreateAnswer(handler);
    const Post_Data = new PostData(handler);
    const ManualQueries = new ManualQuery(handler);

    // Manage registrations
    Reg.processRegister();

    // Manage signins
    Login.processRegister();
    //handler.fetchLoginSession(); // Send client user data when asked

    // Manage post & answer creation
    PostCreate.processData();
    AnswerCreate.processData();

    // Process fetching of post data
    Post_Data.processPostData();

    // Listen for manual queries (keep at bottom of list)
    ManualQueries.listen();
}

// Start express
handler.startServer();