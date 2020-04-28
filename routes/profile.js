/*
    profile/
           /about
           /image
           /qualifications
           /interests
           /upload



           add community posts for logged in
           make all sq1 to sql
*/
const express = require('express');
const fs = require('fs');
const path = require("path");
const multer = require("multer");
const { Pool } = require('pg');
const router = express.Router();
const moment = require('moment')


const { connectionString } = require("../config/keys");

const storage = multer.diskStorage({
    destination: "./public/uploads/profileImages/",
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 2 }, //2mb
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
})


function checkFileType(file, cb) {
    const file_types = /jpeg|jpg|png/;
    const ext_name = file_types.test(path.extname(file.originalname).toLowerCase());
    const mime_type = file_types.test(file.mimetype);

    if (ext_name && mime_type) {
        return cb(null, true);
    } else {
        cb('Error! Images only.');
    }
}


router.get('/:username', async(req, res) => {
    const pool = new Pool({ connectionString: connectionString });
    console.log('/profile');
    try {
        var client = await pool.connect();
        console.log("connection was successful!");
        console.log('Request for ' + req.params.username);
        var sql = "SELECT user_id, username, first_name, last_name, email, dob, profile_image_name FROM users ";
        sql += "WHERE username = $1;";
        var params = [req.params.username];
        var user = await client.query(sql, params);
        //about
        sql = "SELECT about FROM user_about ";
        sql += "WHERE user_id = $1;";
        params = [Number(user.rows[0].user_id)];
        var about = await client.query(sql, params);

        //qualifications
        sql = "SELECT qualification FROM user_qualification ";
        sql += "WHERE user_id = $1;";
        params = [Number(user.rows[0].user_id)];
        var qualifications = await client.query(sql, params);

        //interests
        sql = "SELECT interest from user_interest ";
        sql += "WHERE user_id = $1;";
        params = [Number(user.rows[0].user_id)];
        var interests = await client.query(sql, params);

        //posts
        var posts = [];
        if (typeof req.user == "undefined" || req.user.username != req.params.username) {
            sql = "SELECT * FROM post ";
            sql += "WHERE author_id = $1 AND community_id IS NULL ";
            sql += "ORDER BY time_of_creation DESC;";
        } else { //show community posts only if same user
            sql = "SELECT * FROM post ";
            sql += "WHERE author_id = $1 ";
            sql += "ORDER BY time_of_creation DESC;";
        }
        params = [Number(user.rows[0].user_id)];
        var postsResult = await client.query(sql, params);

        for (var i = 0; i < postsResult.rows.length; i++) {
            let postResult = postsResult.rows[i];
            sql = "SELECT category_name FROM category ";
            sql += "WHERE post_id = $1;";
            params = [postResult.post_id];

            var categoryResults = await client.query(sql, params);
            let categoriesList = "";
            categoryResults.rows.forEach((categoryResult) => {
                // console.log(categoryResult.category_name);
                categoriesList += categoryResult.category_name + ",";
            });



            if (postResult.subforum_id) {
                // console.log(postResult.subforum_id);
                sql = "SELECT name FROM subforum ";
                sql += "WHERE subforum_id = $1;";
                var params = [Number(postResult.subforum_id)];

                var subforumResult = await client.query(sql, params);

                let post = {
                    post_id: postResult.post_id,
                    title: postResult.title,
                    content: postResult.content.substring(0, 100) + "...",
                    time: moment(postResult.time_of_creation).format("h:mm a"),
                    date: moment(postResult.time_of_creation).format("MMM D, YYYY"),
                    upvotes: postResult.upvotes,
                    downvotes: postResult.downvotes,
                    subforum: subforumResult.rows[0].name,
                    categoriesList,
                };

                posts.push(post);
            } else if (postResult.community_id) {
                sql = "SELECT name FROM community ";
                sql += "WHERE community_id = $1;";
                var params = [Number(postResult.community_id)];

                var communityResult = await client.query(sql, params);

                let post = {
                    post_id: postResult.post_id,
                    title: postResult.title,
                    content: postResult.content.substring(0, 100) + "...",
                    time: moment(postResult.time_of_creation).format("h:mm a"),
                    date: moment(postResult.time_of_creation).format("MMM D, YYYY"),
                    upvotes: postResult.upvotes,
                    downvotes: postResult.downvotes,
                    community: communityResult.rows[0].name,
                    categoriesList,
                };
                posts.push(post);
            } else {
                let post = {
                    post_id: postResult.post_id,
                    title: postResult.title,
                    content: postResult.content.substring(0, 100) + "...",
                    time: moment(postResult.time_of_creation).format("h:mm a"),
                    date: moment(postResult.time_of_creation).format("MMM D, YYYY"),
                    upvotes: postResult.upvotes,
                    downvotes: postResult.downvotes,
                    categoriesList,
                };
                posts.push(post);
            }
        }

        //image
        sql = "SELECT profile_image_name FROM users ";
        sql += "WHERE username = $1;";
        params = [
            req.params.username
        ];
        var profile_image = await client.query(sql, params); //image file name

        if (profile_image.rows[0].profile_image_name != null) {
            var profile_image_src = "/../uploads/profileImages/" + profile_image.rows[0].profile_image_name; //for img tag src 
        } else {
            var profile_image_src = "/../uploads/profileImages/default.png"; //for img tag src 
        }

        // console.log(profile_image_src);
        //created subforum
        var created_subforum = [];
        sql = "SELECT * FROM subforum ";
        sql += "WHERE creator_id = $1;";
        params = [Number(user.rows[0].user_id)];
        var subforumsResult = await client.query(sql, params);

        for (var i = 0; i < subforumsResult.rows.length; i++) {
            let subforumResult = subforumsResult.rows[i];

            sql = "SELECT category_name FROM category ";
            sql += "WHERE subforum_id = $1;";
            params = [subforumResult.subforum_id];
            categoryResults = await client.query(sql, params);
            let categoriesList = "";
            categoryResults.rows.forEach((categoryResult) => {
                categoriesList += categoryResult.category_name + ",";
            });

            let subforum = {
                name: subforumResult.name,
                description: subforumResult.description,
                time: moment(subforumResult.time_of_creation).format("h:mm a"),
                date: moment(subforumResult.time_of_creation).format("MMM D, YYYY"),
                creator_username: "",
                categoriesList,
            };
            created_subforum.push(subforum);
        }

        //followed subforum
        var followed_subforum = [];
        sql = "SELECT subforum_id FROM user_subforum ";
        sql += "WHERE user_id = $1;";
        params = [Number(user.rows[0].user_id)];
        var subforum_id = await client.query(sql, params);

        for (var i = 0; i < subforum_id.rows.length; i++) {
            sql = "SELECT * FROM subforum ";
            sql += "WHERE subforum_id = $1;";
            params = [subforum_id.rows[i].subforum_id];
            subforumsResult = await client.query(sql, params);

            let subforumResult = subforumsResult.rows[0];

            sql = "SELECT username FROM users ";
            sql += "WHERE user_id = $1;";
            params = [subforumResult.creator_id];
            var creator = await client.query(sql, params);

            sql = "SELECT category_name FROM category ";
            sql += "WHERE subforum_id = $1;";
            params = [subforumResult.subforum_id];
            categoryResults = await client.query(sql, params);
            categoriesList = [];
            categoryResults.rows.forEach((categoryResult) => {
                categoriesList.push(categoryResult.category_name);
            });

            let subforum = {
                name: subforumResult.name,
                description: subforumResult.description,
                time: moment(subforumResult.time_of_creation).format("h:mm a"),
                date: moment(subforumResult.time_of_creation).format("MMM D, YYYY"),
                creator_username: creator.rows[0].username,
                categoriesList,
            };
            followed_subforum.push(subforum);
        }

        //created community
        var created_community = [];
        sql = "SELECT * FROM community ";
        sql += "WHERE creator_id = $1;";
        params = [Number(user.rows[0].user_id)];
        var communitiesResult = await client.query(sql, params);

        for (var i = 0; i < communitiesResult.rows.length; i++) {
            let communityResult = communitiesResult.rows[i];
            let community = {
                name: communityResult.name,
                description: communityResult.description,
                time: moment(communityResult.time_of_creation).format("h:mm a"),
                date: moment(communityResult.time_of_creation).format("MMM D, YYYY"),
                creator_username: ""
            };
            created_community.push(community);
        }

        //followed community
        var followed_community = [];
        sql = "SELECT community_id FROM user_community ";
        sql += "WHERE user_id = $1;";
        params = [Number(user.rows[0].user_id)];
        var community_id = await client.query(sql, params);

        for (var i = 0; i < community_id.rows.length; i++) {
            sql = "SELECT * FROM community ";
            sql += "WHERE community_id = $1;";
            params = [community_id.rows[i].community_id];
            var community_temp = await client.query(sql, params);

            let communityResult = community_temp.rows[0];

            sql = "SELECT username FROM users ";
            sql += "WHERE user_id = $1;";
            params = [communityResult.creator_id];
            creator = await client.query(sql, params);

            let community = {
                name: communityResult.name,
                description: communityResult.description,
                time: moment(communityResult.time_of_creation).format("h:mm a"),
                date: moment(communityResult.time_of_creation).format("MMM D, YYYY"),
                creator_username: creator.rows[0].username
            };
            followed_community.push(community);
        }


        //pending requests for community membership
        var pending = [];
        for (var i = 0; i < created_community.length; i++) {
            sql = "SELECT community_id, name FROM community WHERE ";
            sql += "name = $1;";
            params = [
                created_community[i].name
            ];
            var community_pending = await client.query(sql, params);

            sql = "SELECT user_id FROM pending_requests WHERE community_id = $1;";
            params = [
                Number(community_pending.rows[0].community_id)
            ];
            var users_pending_id = await client.query(sql, params);

            var users = [];
            for (var j = 0; j < users_pending_id.rows.length; j++) {
                sql = "SELECT username, first_name, last_name, email, profile_image_name FROM users ";
                sql += "WHERE user_id = $1;";
                params = [
                    Number(users_pending_id.rows[j].user_id)
                ];
                var user_pending = await client.query(sql, params);
                if(user_pending.rows[0].profile_image_name != null) {
                    user_pending.rows[0].profile_image_name = "/../uploads/profileImages/" + user_pending.rows[0].profile_image_name;
                } else {
                    user_pending.rows[0].profile_image_name = "/../uploads/profileImages/default.png";
                }
                users.push(user_pending.rows[0]);
            }
            if (users.length != 0) {
                let p = {
                    community_name: community_pending.rows[0].name,
                    users
                }
                pending.push(p);
            }
        }

        client.release();

        // age
        var user_dob = user.rows[0].dob;
        var diff_ms = Date.now() - user_dob.getTime();
        var age_dt = new Date(diff_ms);
        var age = Math.abs(age_dt.getUTCFullYear() - 1970);


        console.log(qualifications.rows);
        var data = {
            current_user_username: req.params.username,
            user: user.rows[0], // --all column names except password, profile_image_name, user_id
            user_age: age,
            about: about.rows[0], // --about
            qualifications: qualifications.rows, //array of qualifications --qualifications
            interests: interests.rows, //array of interests --interests
            profile_image_src: profile_image_src, //access directly
            post: posts, //array of posts --all info
            // file: file, //2D array of files(MULTIPLE files per post(absolute file path)) --file_name
            created_subforum: created_subforum, //array of created subforums --all info
            followed_subforum: followed_subforum, //array of followed subforums --all info
            created_community: created_community, //array of created communities --all info
            followed_community: followed_community, //array of followed communities --all info
            pending: pending //array of community--users(users in an array)
        };

        res.render("profile", { userdata: data, user: req.user, title: user.rows[0].username });
    } catch (err) {
        client.release();
        console.log("ERROR IS:", err);
    }
});



router.post('/about', async(req, res) => {
    res.send("hello");

    const pool = new Pool({ connectionString: connectionString });

    try {
        var client = await pool.connect()
        console.log("connection successful!");
        var sql = "INSERT INTO user_about";
        sql += "(about,user_id)";
        sql += "VALUES ($1, $2)";
        var params = [
            req.body.about,
            req.body.user_id
        ];

        var about = await client.query(sql, params);
        client.release();
    } catch (err) {
        client.release();
        console.log("ERROR IS:", err);
    }
});

router.post('/image', upload.single("myFile"), async(req, res) => {

    const pool = new Pool({ connectionString: connectionString });

    try {
        var client = await pool.connect();
        console.log("connection successful!");

        var sql = "SELECT profile_image_name FROM users ";
        sql += "WHERE user_id = $1;";
        var params = [
            req.user.user_id //user_id
        ];

        var image = await client.query(sql, params);

        if (image.rows[0].profile_image_name != null) {
            var old_file_name = image.rows[0].profile_image_name;
            fs.unlinkSync(process.cwd() + "/public/uploads/profileImages/" + old_file_name);
        }

        sql = "UPDATE users SET profile_image_name = $1 ";
        sql += "WHERE user_id = $2;";
        params = [
            req.file.filename,
            req.user.user_id //user_id
        ];

        var new_image = await client.query(sql, params);
        client.release();
        res.redirect('/profile/' + req.user.username);
    } catch (err) {
        client.release();
        console.log("ERROR IN post/image:", err);
    }

});

router.post('/qualifications', async(req, res) => { //qualifications array
    res.send("hello");

    const pool = new Pool({ connectionString: connectionString });

    try {
        var client = await pool.connect();
        console.log("connection successful!");
        for (var i = 0; i < req.body.qualifications.length; i++) {
            var sql = "INSERT INTO user_qualification";
            sql += "(qualification,user_id)";
            sql += "VALUES ($1, $2)";
            var params = [
                req.body.qualifications,
                req.body.user_id
            ];
            var qualifications = await client.query(sql, params);
        }
        client.release();
    } catch (err) {
        client.release();
        console.log("ERROR IS:", err);
    }
});

router.post('/interests', async(req, res) => { //interests array
    res.send("hello");

    const pool = new Pool({ connectionString: connectionString });

    try {
        var client = await pool.connect()
        console.log("connection successful!");

        for (var i = 0; i < req.body.interests.length; i++) {
            var sql = "INSERT INTO user_interest";
            sql += "(interest,user_id)";
            sql += "VALUES ($1, $2)";
            var params = [
                req.body.interests,
                req.body.user_id
            ];
            var interests = await client.query(sql, params);
        }
        client.release();
    } catch (err) {
        client.release();
        console.log("ERROR IS:", err);
    }

});

module.exports = router;