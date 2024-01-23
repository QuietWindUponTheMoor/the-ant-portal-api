CREATE TABLE IF NOT EXISTS posts (
    -- All
    postID VARCHAR(32) PRIMARY KEY NOT NULL,
    userID VARCHAR(32) NOT NULL,
    type INT(1) NOT NULL,
    -- 0 = Question 
    -- 1 = General
    -- 2 = informative
    -- 3 = observation
    -- 4 = nuptial_flight
    title VARCHAR(128),
    body TEXT NOT NULL,
    images TEXT DEFAULT null,
    views BIGINT(44) DEFAULT 0 NOT NULL,
    upvotes BIGINT(44) DEFAULT 0 NOT NULL,
    downvotes BIGINT(44) DEFAULT 0 NOT NULL,
    answers BIGINT(44) DEFAULT 0 NOT NULL,
    time BIGINT(44) NOT NULL,
    editedBy VARCHAR(32) DEFAULT '0' NOT NULL,
    editTime BIGINT(44) DEFAULT null,
    tags VARCHAR(140) DEFAULT null,

    -- Observations & nuptial flights
    lat VARCHAR(512) DEFAULT null,
    `long` VARCHAR(512) DEFAULT null,
    species VARCHAR(256) DEFAULT 'unknown' NOT NULL,

    -- Nuptial flights
    temperature INT(3) DEFAULT null, -- Fahrenheight
    wind_speed INT(3) DEFAULT null, -- MPH: https://www.unitconverters.net/speed/kph-to-mph.htm
    moon_cycle INT(1) DEFAULT null
    -- https://nineplanets.org/moon/phase/today/
    -- 0 = new-moon
    -- 1 = waxing-crescent
    -- 2 = first-quarter
    -- 3 = waxing-gibbous
    -- 4 = full-moon
    -- 5 = waning-gibbous
    -- 6 = third-quarter
    -- 7 = waning-crescent
);

DROP TRIGGER IF EXISTS update_posts_votes;
DROP TRIGGER IF EXISTS update_posts_votes_update;
DROP TRIGGER IF EXISTS update_posts_votes_delete;
DELIMITER //

CREATE TRIGGER update_posts_votes
AFTER INSERT ON voting
FOR EACH ROW
BEGIN
    IF NEW.type = 0 THEN
        -- New vote for a post (type = 0)
        UPDATE posts p
        SET p.upvotes = p.upvotes + IF(NEW.updown = 1, 1, 0),
            p.downvotes = p.downvotes + IF(NEW.updown = 0, 1, 0)
        WHERE p.postID = NEW.itemID;
    END IF;
END;
//
CREATE TRIGGER update_posts_votes_update
AFTER UPDATE ON voting
FOR EACH ROW
BEGIN
    IF OLD.type = 0 THEN
        -- Update for a post (type = 0)
        UPDATE posts p
        SET p.upvotes = p.upvotes - IF(OLD.updown = 1, 1, 0) + IF(NEW.updown = 1, 1, 0),
            p.downvotes = p.downvotes - IF(OLD.updown = 0, 1, 0) + IF(NEW.updown = 0, 1, 0)
        WHERE p.postID = NEW.itemID;
    END IF;
END;
//
CREATE TRIGGER update_posts_votes_delete
AFTER DELETE ON voting
FOR EACH ROW
BEGIN
    IF OLD.type = 0 THEN
        -- Delete for a post (type = 0)
        UPDATE posts p
        SET p.upvotes = p.upvotes - IF(OLD.updown = 1, 1, 0),
            p.downvotes = p.downvotes - IF(OLD.updown = 0, 1, 0)
        WHERE p.postID = OLD.itemID;
    END IF;
END;
//
DELIMITER ;