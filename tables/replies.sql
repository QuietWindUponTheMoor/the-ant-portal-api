CREATE TABLE IF NOT EXISTS replies (
    replyID VARCHAR(32) PRIMARY KEY NOT NULL,
    forItemID VARCHAR(32) NOT NULL,
    userID VARCHAR(32) NOT NULL,
    type TINYINT(1) NOT NULL,
    time BIGINT(44) NOT NULL,
    /*
    itemType:
    0 = Comment/reply for a post
    5 = Comment/reply for an answer to a question (only applies to questions)
    */
    content TEXT NOT NULL
);