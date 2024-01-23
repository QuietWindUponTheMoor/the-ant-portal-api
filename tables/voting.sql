CREATE TABLE IF NOT EXISTS voting (
    itemID VARCHAR(32) PRIMARY KEY NOT NULL, -- The ID of the item that was voted on
    userID VARCHAR(32) NOT NULL, -- ID of the user who voted
    type TINYINT(1) NOT NULL,
    /*
    0 = For a post, the original post
    1 = For the answer of a question
    2 = For the reply/comment of an post (original)'s comment/reply
    3 = For an question's answer's reply/comment
    */
    updown TINYINT(1) NOT NULL
    /*
    0 = downvote
    1 = upvote
    */
);