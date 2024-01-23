CREATE TABLE IF NOT EXISTS answers (
    -- All
    answerID VARCHAR(32) PRIMARY KEY NOT NULL,
    forPostID VARCHAR(32) NOT NULL,
    userID VARCHAR(32) NOT NULL,
    isAcceptedAnswer TINYINT(1) DEFAULT 0 NOT NULL,
    body TEXT NOT NULL,
    images TEXT DEFAULT null,
    upvotes BIGINT(44) DEFAULT 0 NOT NULL,
    downvotes BIGINT(44) DEFAULT 0 NOT NULL,
    time BIGINT(44) NOT NULL,
    editedBy VARCHAR(32) DEFAULT '0' NOT NULL,
    editTime BIGINT(44) DEFAULT null
);

DROP TRIGGER IF EXISTS update_answers_votes;
DROP TRIGGER IF EXISTS update_answers_votes_update;
DROP TRIGGER IF EXISTS update_answers_votes_delete;
DELIMITER //

CREATE TRIGGER update_answers_votes
AFTER INSERT ON voting
FOR EACH ROW
BEGIN
    IF NEW.type = 1 THEN
        -- New vote for an answer (type = 1)
        UPDATE answers a
        SET a.upvotes = a.upvotes + IF(NEW.updown = 1, 1, 0),
            a.downvotes = a.downvotes + IF(NEW.updown = 0, 1, 0)
        WHERE a.answerID = NEW.itemID;
    END IF;
END;
//
CREATE TRIGGER update_answers_votes_update
AFTER UPDATE ON voting
FOR EACH ROW
BEGIN
    IF OLD.type = 1 THEN
        -- Update for an answer (type = 1)
        UPDATE answers a
        SET a.upvotes = a.upvotes - IF(OLD.updown = 1, 1, 0) + IF(NEW.updown = 1, 1, 0),
            a.downvotes = a.downvotes - IF(OLD.updown = 0, 1, 0) + IF(NEW.updown = 0, 1, 0)
        WHERE a.answerID = NEW.itemID;
    END IF;
END;
//
CREATE TRIGGER update_answers_votes_delete
AFTER DELETE ON voting
FOR EACH ROW
BEGIN
    IF OLD.type = 1 THEN
        -- Delete for an answer (type = 1)
        UPDATE answers a
        SET a.upvotes = a.upvotes - IF(OLD.updown = 1, 1, 0),
            a.downvotes = a.downvotes - IF(OLD.updown = 0, 1, 0)
        WHERE a.answerID = OLD.itemID;
    END IF;
END;
//
DELIMITER ;