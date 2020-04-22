CREATE TABLE users (
    user_id BIGSERIAL NOT NULL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL, 
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password CHAR(60) NOT NULL,
    dob DATE NOT NULL,
    profile_image_name text,
    UNIQUE(email),
    UNIQUE (username)
);

CREATE TABLE user_about(
    about TEXT,
    user_id BIGINT REFERENCES users(user_id)
);


CREATE TABLE user_interest (
    interest TEXT,
    user_id BIGINT REFERENCES users(user_id) 
);

CREATE TABLE user_qualification (
    qualification TEXT,
    user_id BIGINT REFERENCES users(user_id)
);

CREATE TABLE feedback (
    feedback_id BIGSERIAL NOT NULL PRIMARY KEY,
    content TEXT NOT NULL,
    time_of_feedback TIMESTAMP,
    user_id BIGINT REFERENCES users(user_id)
);

CREATE TABLE subforum (
    subforum_id BIGSERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    time_of_creation TIMESTAMP,
    creator_id BIGINT REFERENCES users(user_id),
    UNIQUE(name)
);

CREATE TABLE community (
    community_id BIGSERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    time_of_creation TIMESTAMP,
    creator_id BIGINT REFERENCES users(user_id),
    UNIQUE(name)
);

--to display followed subforums
CREATE TABLE user_subforum (
    user_id BIGINT REFERENCES users(user_id),
    subforum_id BIGINT REFERENCES subforum(subforum_id)
);

--to display followed community
CREATE TABLE user_community (
    user_id BIGINT REFERENCES users(user_id),
    community_id BIGINT REFERENCES community(community_id)
);

CREATE TABLE pending_requests (
    user_id BIGINT REFERENCES users(user_id),
    community_id BIGINT REFERENCES community(community_id)
)

CREATE TABLE post (
    post_id BIGSERIAL NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    time_of_creation TIMESTAMP,
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    author_id BIGINT REFERENCES users(user_id),
    subforum_id BIGINT REFERENCES subforum(subforum_id),
    community_id BIGINT REFERENCES community(community_id)
);

CREATE TABLE post_file (
    file_name text NOT NULL,
    post_id BIGINT REFERENCES post(post_id)
);

CREATE TABLE comment (
    comment_id BIGSERIAL NOT NULL PRIMARY KEY,
    content TEXT NOT NULL,
    time_of_creation TIMESTAMP,
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    author_id BIGINT REFERENCES users(user_id),
    post_id BIGINT REFERENCES post(post_id)
);

CREATE TABLE child_comment (
    comment_id BIGSERIAL NOT NULL PRIMARY KEY,
    content TEXT NOT NULL,
    time_of_creation TIMESTAMP,
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    author_id BIGINT REFERENCES users(user_id),
    parent_comment_id BIGINT REFERENCES comment(comment_id) DEFAULT null
);


CREATE TABLE category (
    category_name TEXT NOT NULL,
    post_id BIGINT REFERENCES post(post_id),
    subforum_id BIGINT REFERENCES subforum(subforum_id)
);

CREATE TABLE chat (
    chat_id BIGSERIAL NOT NULL PRIMARY KEY,
    time_of_creation TIMESTAMP,
    user1 VARCHAR(50) NOT NULL REFERENCES users(username),
    user2 VARCHAR(50) NOT NULL REFERENCES users(username)
);

CREATE TABLE message (
    message_id BIGSERIAL NOT NULL PRIMARY KEY,
    content TEXT NOT NULL,
    message_timestamp TIMESTAMP,
    sender VARCHAR(50) REFERENCES users(username),
    receiver VARCHAR(50) REFERENCES users(username),
    chat_id BIGINT REFERENCES chat(chat_id)
); 


