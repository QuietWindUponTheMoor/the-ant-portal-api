CREATE TABLE IF NOT EXISTS owned_badges (
    recordID BIGINT(44) PRIMARY KEY AUTO_INCREMENT NOT NULL,
    userID BIGINT(44) NOT NULL,
    badge INT(22) NOT NULL,
    earned_on_date VARCHAR(256) NOT NULL
);