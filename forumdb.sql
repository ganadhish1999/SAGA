CREATE DATABASE test;

CREATE TABLE users (
    user_id BIGSERIAL NOT NULL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL, 
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password CHAR(60) NOT NULL,
    dob DATE NOT NULL,
    profile_image_name text
    UNIQUE(email)
);

CREATE TABLE about(
    about TEXT,
    user_id BIGINT REFERENCES users(user_id),
);


CREATE TABLE interests (
    interests TEXT,
    user_id BIGINT REFERENCES users(user_id) 
);

CREATE TABLE qualifications (
    qualifications TEXT,
    user_id BIGINT REFERENCES users(user_id)
);

CREATE TABLE feedback (
    feedback_id BIGSERIAL NOT NULL PRIMARY KEY,
    content TEXT,
    timestamp TIMESTAMP,
    user_id BIGINT REFERENCES users(user_id)
);

CREATE TABLE subforum (
    subforum_id BIGSERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    timestamp TIMESTAMP,
    creator_id BIGINT REFERENCES users(user_id),
    UNIQUE(name)
);

CREATE TABLE community (
    community_id BIGSERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    timestamp TIMESTAMP,
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

CREATE TABLE post (
    post_id BIGSERIAL NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP,
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    author_id BIGINT REFERENCES users(user_id),
    subforum_id BIGINT REFERENCES subforum(subforum_id),
    community_id BIGINT REFERENCES community(community_id),
);

CREATE TABLE post_file (
    file_name text NOT NULL,
    post_id BIGINT REFERENCES post(post_id)
)

CREATE TABLE comment (
    comment_id BIGSERIAL NOT NULL PRIMARY KEY,
    content TEXT NOT NULL,
    timestamp TIMESTAMP,
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    author_id BIGINT REFERENCES users(user_id),
    post_id BIGINT REFERENCES post(post_id),
    parent_comment_id BIGINT REFERENCES comment(comment_id) DEFAULT null
);


CREATE TABLE category (
    category_name TEXT NOT NULL,
    post_id BIGINT REFERENCES post(post_id),
    subforum_id BIGINT REFERENCES subforum(subforum_id)
);

CREATE TABLE chat (
    chat_id BIGSERIAL NOT NULL PRIMARY KEY,
    timestamp TIMESTAMP,
    user1_id BIGINT REFERENCES users(user_id),
    user2_id BIGINT REFERENCES users(user_id)
);

CREATE TABLE message (
    content TEXT NOT NULL,
    timestamp TIMESTAMP,
    sender_id BIGINT REFERENCES users(user_id),
    reciever_id BIGINT REFERENCES users(user_id),
    chat_id BIGINT REFERENCES chat(chat_id)
);


--all functions of forum as queries

/*
logging in users with 
        username, first_name, last_name, email, password, dob
    user_id is PK and is auto-incremented
*/

INSERT INTO users
    (username,first_name,last_name,email,password,dob)
VALUES
    ('ram123', 'ram', 'shah', 'ram@sita.com', 'qwerty', '2000-01-01'),
    ('rahul123', 'rahul', 'shah', 'rahul@sita.com', 'qwerty', '2000-02-01'),
    ('karan123', 'karan', 'shah', 'karan@sita.com', 'qwerty', '2000-03-01');


/*
users filling in profile with
        about
        image
    user_id is the FK and is present as PK in users table
each user can have only one profile
*/

INSERT INTO about 
    (about,user_id)
VALUES
    ('about me', 1),
    ('about me', 2),
    ('about me', 3);


/*
users filling in interests with
        interest 
    user_id is the FK and is present as PK in users table
*/

INSERT INTO interests
    (interests,user_id)
VALUES
    ('reading', 1),
    ('writing', 2),
    ('sleeping', 3);


/*
users filling in qualifications with
        qualifications
    user_id is the FK and is present as PK in users table
*/

INSERT INTO qualifications
    (qualifications,user_id)
VALUES
    ('BCOM', 1),
    ('BTECH', 2),
    ('BAF', 3);


/*
users filling in feedback with
        content
    timestamp is added automatically
    feedback_id is PK and is auto-incremented
    user_id is the FK and is present as PK in users table
each user can have multiple feedbacks
*/

INSERT INTO feedback 
    (content,timestamp,user_id)
VALUES
    ('its good', CURRENT_TIMESTAMP, 1),
    ('its okay', CURRENT_TIMESTAMP, 2),
    ('its bad', CURRENT_TIMESTAMP, 3);


/*
users can create subforum with
        name(unique)
        description
    timestamp is added automatically
    subforum_id is PK and is auto-incremented
    creator_id is the FK and is present as PK in users table as users_id
each user can create multiple subforums
users also have to enter category (multiple values allowed)
        category_name is PK and has to be entered by user
    category has a subforum_id which will be found automatically by name of subforum(as it is unique)
    category has a post_id which will be null for this operation
*/

INSERT INTO subforum
    (name,description,timestamp,creator_id)
VALUES
    ('dark', 'dark is the best show ever', CURRENT_TIMESTAMP, 1);

INSERT INTO category 
    (category_name, subforum_id)
    (SELECT 'netflix', subforum_id 
        FROM subforum
        WHERE name = 'dark'
    );


/*
users can create community with
        name(unique)
        description
    timestamp is added automatically
    community_id is PK and is auto-incremented
    creator_id is the FK and is present as PK in users table as users_id
each user can create multiple communities
*/

INSERT INTO community
    (name,description,timestamp,creator_id)
VALUES
    ('harry potter', 'ron hermoine', CURRENT_TIMESTAMP, 2);


/*
users can follow a subforum, shown in table user_subforum
    on following
        user_id is added automatically 
        subforum_id will be added automatically by finding it using name of subforum(as it is unique)
*/

INSERT INTO user_subforum
    (user_id,subforum_id)
    (SELECT 3, subforum_id
        FROM subforum
        WHERE name='dark'
    );


/*
user can be added in a community, shown in table user_community
    on accepting invition, etc.
        user_id is added automatically 
        community_id will be added automatically by finding it using name of community(as it is unique)
*/

    INSERT INTO user_community
        (user_id,community_id)
        (SELECT 3, community_id
            FROM community
            WHERE name='harry potter'
        );


/*
user can create a post with 
        title
        content
    timestamp is added automatically
    post_id is PK and is auto-incremented
    author_id is FK and is present as PK in users table
    subforum_id is FK and will not be null if post is added in subforum(PK IN subforum table)
    community_id is FK and will not be null if post is added in community(PK IN community table)
    
users also have to enter category (multiple values allowed)
        category_name is PK and has to be entered by user
    category has a post_id which will be found automatically by name of post(as it is unique)
    category has a subforum_id which will be null for this operation
*/
--in this example, post is part of a subforum, so community_id = null

INSERT INTO post
    (title,content,timestamp,author_id,subforum_id)
VALUES 
    ('my post 2', 'content 2', CURRENT_TIMESTAMP, 1, 1);

INSERT INTO category
    (category_name,post_id)
    (SELECT 'new category 2', post_id 
        FROM post
        WHERE title = 'my post 2' AND content = 'content 2' AND subforum_id = 1 AND author_id = '1'
    );
    
/*
user can comment on posts with
        content
    timestamp is added automatically
    comment_id is PK and is auto-incremented
    author_id is FK and is present as PK in users table
    post_id is FK and is present as PK in post table
    parent_comment_id is FK and is present as PK in comment table
*/

-- primary insert(comment on post)
-- here, parent_comment_id is null
INSERT INTO comment 
    (content,timestamp,author_id,post_id)
VALUES  
    ('this is a parent comment', CURRENT_TIMESTAMP, 1, 1);

-- secondary comment(comment on comment)
-- here, parent_comment_id is primary comment's comment_id
INSERT INTO comment
    (content,timestamp,author_id,post_id, parent_comment_id)
VALUES
    ('this is a child comment', CURRENT_TIMESTAMP, 1, 1, 1);



/*
user can upvote or downvote posts or comments
*/

UPDATE post
    SET upvotes = upvotes + 1
    WHERE post_id = 1;

UPDATE comment
    SET downvotes = downvotes + 1
    WHERE comment_id = 1;


/*
user can delete a post
    if user is creator of post
        delete all comments corresponding to given post_id
        make all post_id null in category table
        delete row from post table
*/

DELETE FROM comment
    WHERE post_id IN 
        (SELECT post_id 
            FROM post 
            WHERE post_id = 1 AND author_id = 1
        );

UPDATE category
    SET post_id = NULL
    WHERE post_id IN 
        (SELECT post_id 
            FROM post 
            WHERE post_id = 1 AND author_id = 1
        );

DELETE FROM post
    WHERE post_id = 1 AND author_id = 1;
       


/*
user can delete a subforum/community
    if user is creator of subforum/community
        delete all posts corresponding to subforum/community(do process of deleting post)
        delete all rows in user_subforum/community corresponding to subforum/community
        make all subforum_id null in category table(not for community)
        delete row from subforum/community
*/

DELETE FROM comment
    WHERE post_id IN 
        (SELECT post_id 
            FROM post 
            WHERE subforum_id IN 
                (SELECT subforum_id 
                    FROM subforum 
                    WHERE subforum_id = 1 AND creator_id = 1
                )
        );

UPDATE category
    SET post_id = NULL
    WHERE post_id IN 
        (SELECT post_id 
            FROM post 
            WHERE subforum_id IN 
                (SELECT subforum_id 
                    FROM subforum 
                    WHERE subforum_id = 1 AND creator_id = 1
                )
        );

DELETE FROM post
    WHERE post_id IN 
        (SELECT post_id 
            FROM post 
            WHERE subforum_id IN 
                (SELECT subforum_id 
                    FROM subforum 
                    WHERE subforum_id = 1 AND creator_id = 1
                )
        );
--similarly for community

DELETE FROM user_subforum
    WHERE subforum_id IN 
        (SELECT subforum_id 
            FROM subforum 
            WHERE subforum_id = 1 AND creator_id = 1
        );
--similarly for community

UPDATE category
    SET subforum_id = NULL
    WHERE subforum_id IN 
        (SELECT subforum_id 
            FROM subforum 
            WHERE subforum_id = 1 AND creator_id = 1
        );
--only for subforum

DELETE FROM subforum 
    WHERE subforum_id = 1 AND creator_id = 1;
--similarly for community

/*
user can delete a comment 
    if user is creator of post
    delete row from comment table for corresponding comment_id
*/

DELETE FROM comment
    WHERE comment_id = 1;


/*
users can chat with each other with
        user_id for creator(FK, is PK in users table)
        user_id for other user in chat(FK, is PK in users table)
    timestamp is added automatically
    chat_id is PK and is auto-incremented
*/

INSERT INTO chat
    (user1_id,user2_id,timestamp)
VALUES
    (1,2,CURRENT_TIMESTAMP);


/*
users can send messages in the chat with
        content
        sender_id for creator(FK, is PK in users table)
        reciever_id for other user in chat(FK, is PK in users table)
    timestamp is added automatically
    message_id is PK and is autp-incremented
    chat_id is FK and is PK in chat table
*/

INSERT INTO message
    (content,sender_id,reciever_id,timestamp,chat_id)
VALUES
    ('how are you?', 1, 2, CURRENT_TIMESTAMP, 1);