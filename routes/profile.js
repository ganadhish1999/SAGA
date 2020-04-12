/*
    profile/
           /about
           /image
           /qualifications
           /interests
           /upload
*/
const express = require('express');
const fs = require('fs');
const path = require("path");
const multer = require("multer");
const { Client } = require('pg');
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
    const mime_type = file_type.test(file.mimetype);

    if (ext_name && mime_type) {
        return cb(null, true);
    } else {
        cb('Error! Images only.');
    }
}
router.get('/:username', async(req, res) => {
    // res.send("Profile");
    // console.log(req.params.username);
    const client = new Client({ connectionString: connectionString });
    console.log('/profile');
    try {
        await client.connect();
        console.log("connection was successful!");

        var sql = "SELECT user_id, username, first_name, last_name, email, dob, profile_image_name FROM users ";
        sql += "WHERE username = $1;";
        var params = [
            req.params.username
        ];
        var user = await client.query(sql, params);
        console.log(Number(user.rows[0].user_id));
        //about
        // Error here
        /* sql = "SELECT about FROM user_about";
        sql += "WHERE username = $1;";
        params = [
            req.params.username
        ];
        var about = await client.query(sql, params);
        console.log(about.rows[0]); */


        //qualifications
        sql = "SELECT qualifications FROM user_qualifications ";
        sql += "WHERE user_id = $1;";
        params = [
            Number(user.rows[0].user_id)
        ];
        var qualifications = await client.query(sql, params);
        console.log(qualifications.rows);

        //posts
        category_post = [];
        subforum_community_post = [];
        sql = "SELECT * FROM post ";
        sql += "WHERE author_id = $1 "
        sql += "ORDER BY time_of_creation DESC;"
        params = [
            Number(user.rows[0].user_id) //user_id
        ];
        var post = await client.query(sql, params);

        for (var i = 0; i < post.rows.length; i++) {
            var sql1 = "SELECT category_name FROM category ";
            sql1 += "WHERE post_id = $1;"
            params1 = [
                post.rows[i].post_id
            ];

            var category = await client.query(sql1, params1);
            category_post.push(category.rows); //list of categories of posts(2D array as each post has multiple categories)

            if (post.rows[i].subforum_id) {
                var sql2 = "SELECT name FROM subforum ";
                sql2 += "WHERE subforum_id = $1 ";
                var params2 = [Number(post.rows[i].subforum_id)];
                var subforum_name = await client.query(sql2, params2);
                subforum_community_post.push(subforum_name.rows[i]);

            } else if (post.rows[i].community_id) {
                var sql2 = "SELECT name FROM community ";
                sql2 += "WHERE community_id = $1 ";
                var params2 = [Number(post.rows[i].community_id)];
                var community_name = await client.query(sql2, params2);
                subforum_community_post.push(community_name.rows[i]);

            } else { subforum_community_post.push({ name: null }); }

            // var sql3 = "SELECT file_name FROM post_file ";
            // sql3 += "WHERE post_id = $1;";
            // var params3 = [Number(post.rows[i].post_id)];

            // var file_temp = await client.query(sql3, params3); //multiple files per post
            // for (var i = 0; i < file_temp.rows.length; i++) {
            //     file_temp.rows[i].file_name = process.cwd() + "/public/uploads/postFiles/" + file_temp.rows[i].file_name;
            // }
            // file.push(file_temp.rows);

        }
        console.log(post.rows);

        //interests
        sql = "SELECT interests from user_interests ";
        sql += "WHERE user_id = $1;";
        params = [
            Number(user.rows[0].user_id)
        ];
        var interests = await client.query(sql, params); 
        console.log(interests.rows);
        
        /* //image
        sql = "SELECT profile_image_name FROM users ";
        sql += "WHERE username = $1;"
        params = [
            req.params.username
        ];
        var profile_image = await client.query(sql, params); //image file name
        if(!profile_image.rows.length != 0)
            var profile_image_src = process.cwd() + "/public/uploads/profileImages/" + profile_image.rows[0].profile_image_name; //for img tag src */

        //followed subforums
        followed_subforum = [];
        category_followed_subforum = [];
        sql = "SELECT subforum_id FROM user_subforum ";
        sql += "WHERE user_id = $1;"
        params = [
            Number(user.rows[0].user_id) //user_id
        ];
        var subforum_id = await client.query(sql, params);
        for (var i = 0; i < subforum_id.rows.length; i++) {
            sql = "SELECT * FROM subforum ";
            sql += "WHERE subforum_id = $1;";
            params = [
                subforum_id.rows[i].subforum_id
            ]
            var subforum_followed = await client.query(sql, params);
            followed_subforum.push(subforum_followed.rows[i]);
        }
        console.log(followed_subforum.rows)

        // age
        var user_dob = user.rows[0].dob;
        // console.log(user_dob)
        var diff_ms = Date.now() - user_dob.getTime();
        var age_dt = new Date(diff_ms);
        var age = Math.abs(age_dt.getUTCFullYear() - 1970);
        
        var data = {
            user: user.rows[0], // --all column names except password, profile_image_name, user_id
            user_age: age,
            // about: about.rows[0], // --about
            qualifications: qualifications.rows, //array of qualifications --qualifications
            interests: interests.rows, //array of interests --interests
            // profile_image_src: profile_image_src //access directly
            post: post.rows, //array of posts --all column names
            category_post: category_post, //2D array of categories(MULTIPLE categories per post) --category_name
            // file: file, //2D array of files(MULTIPLE files per post(absolute file path)) --file_name
            // followed_subforum: followed_subforum, //array of followed subforums --all column names

        };
        
        res.render('profile', {userdata:data, user:req.user});

    } catch (err) {
        console.log("ERROR IS:", err);
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/', async(req, res) => {
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        client.connect()
        console.log("connection successful!");

        //user
        var sql = "SELECT username, first_name, last_name, email, dob FROM users ";
        sql += "WHERE user_id = $1;";
        var params = [
            1 //user_id
        ];
        var user = await client.query(sql, params);

        //about
        sql = "SELECT about FROM about";
        sql += "WHERE user_id = $1";
        params = [
            1 //user_id
        ];
        var about = await client.query(sql, params);

        //qualifications
        sql = "SELECT qualifications from qualifications";
        sql += "WHERE user_id = $1";
        params = [
            1 //user_id
        ];
        var qualifications = await client.query(sql, params);

        //interests
        sql = "SELECT interests from interests";
        sql += "WHERE user_id = $1";
        params = [
            1 //user_id
        ];
        var interests = await client.query(sql, params);

        //image
        sql = "SELECT profile_image_name FROM users ";
        sql += "WHERE user_id = $1;"
        params = [
            1 //user_id
        ];
        var profile_image = await client.query(sql, params); //image file name
        var profile_image_src = process.cwd() + "/public/uploads/profileImages/" + profile_image.rows[0].profile_image_name; //for img tag src

        //posts
        category_post = [];
        subforum_community_post = [];
        sql = "SELECT * FROM post ";
        sql += "WHERE author_id = $1 "
        sql += "ORDER BY time_of_creation DESC;"
        params = [
            1 //user_id
        ];
        var post = await client.query(sql, params);

        for (var i = 0; i < post.rows.length; i++) {
            var sql1 = "SELECT category_name FROM category ";
            sql1 += "WHERE post_id = $1;"
            params1 = [
                post.rows[i].post_id
            ];

            var category = await client.query(sql1, params1);
            category_post.push(category.rows); //list of categories of posts(2D array as each post has multiple categories)

            if (post.rows[0].subforum_id) {
                var sql2 = "SELECT name FROM subforum ";
                sql2 += "WHERE subforum_id = $1 ";
                var params2 = [Number(post.rows[0].subforum_id)];
                var subforum_name = await client.query(sql2, params2);
                subforum_community_post.push(subforum_name.rows[0]);

            } else if (post.rows[0].community_id) {
                var sql2 = "SELECT name FROM community ";
                sql2 += "WHERE community_id = $1 ";
                var params2 = [Number(post.rows[0].community_id)];
                var community_name = await client.query(sql2, params2);
                subforum_community_post.push(community_name.rows[0]);

            } else { subforum_community_post.push({ name: null }); }

            var sql3 = "SELECT file_name FROM post_file ";
            sql3 += "WHERE post_id = $1;";
            var params3 = [Number(post.rows[0].post_id)];

            var file_temp = await client.query(sql3, params3); //multiple files per post
            for (var i = 0; i < file_temp.rows.length; i++) {
                file_temp.rows[i].file_name = process.cwd() + "/public/uploads/postFiles/" + file_temp.rows[i].file_name;
            }
            file.push(file_temp.rows);

        }

        //cretaed subforums
        var category_created_subforum = [];
        sql = "SELECT * FROM subforum ";
        sql += "WHERE creator_id = $1;"
        params = [
            1 //user_id
        ];
        var subforum_created = await client.query(sql, params);
        //subforum categories
        for (var i = 0; i < post.rows.length; i++) {
            sql = "SELECT category_name FROM category ";
            sql += "WHERE subforum_id = $1;"
            params = [
                subforum_created.rows[i].subforum_id
            ]
            v
            var subforum_category_1 = await client.query(sql, params);
            category_created_subforum.push(subforum_category_1);
        }

        //followed subforums
        followed_subforum = [];
        category_followed_subforum = [];
        sql = "SELECT subforum_id FROM user_subforum ";
        sql += "WHERE user_id = $1;"
        params = [
            1 //user_id
        ];
        var subforum_id = await client.query(sql, params);
        for (var i = 0; i < subforum_id.rows.length; i++) {
            sql = "SELECT * FROM subforum ";
            sql += "WHERE subforum_id = $1;";
            params = [
                subforum_id.rows[i].subforum_id
            ]
            var subforum_followed = await client.query(sql, params);
            followed_subforum.push(subforum_followed.rows[0]);
        }
        //subforum categories
        for (var i = 0; i < post.rows.length; i++) {
            sql = "SELECT category_name FROM category ";
            sql += "WHERE subforum_id = $1;"
            params = [
                subforum_id.rows[i].subforum_id
            ]
            v
            var subforum_category_2 = await client.query(sql, params);
            category_followed_subforum.push(subforum_category_2.rows);
        }

        //cretaed communities
        sql = "SELECT * FROM community ";
        sql += "WHERE creator_id = $1;"
        params = [
            1 //user_id
        ];
        var community_created = await client.query(sql, params);

        //member of communities
        member_community = []
        sql = "SELECT community_id FROM user_community ";
        sql += "WHERE user_id = $1;";
        params = [
            1 //user_id
        ];
        var community_id = await client.query(sql, params);
        for (var i = 0; i < community_id.rows.length; i++) {
            sql = "SELECT * FROM community ";
            sql += "WHERE community_id = $1;";
            params = [
                community_id.rows[i].community_id
            ]
            var community_member = await client.query(sql, params);
            member_community.push(community_member.rows[0]);
        }

        //chats
        sql = "SELECT * FROM chat ";
        sql += "WHERE user1_id = $1 OR user2_id = $1;"
        params = [
            1 //user_id
        ];
        var chat = await client.query(sql, params);

    } catch (err) {
        console.log("ERROR IS:", err);
    }

    var data = {
        user: user.rows[0], // --all column names except password, profile_image_name, user_id
        about: about.rows[0], // --about
        qualifications: qualifications.rows, //array of qualifications --qualifications
        interests: interests.rows, //array of interests --interests
        profile_image_src: profile_image_src, //access directly
        post: post.rows, //array of posts --all column names
        category_post: category_post, //2D array of categories(MULTIPLE categories per post) --category_name
        file: file, //2D array of files(MULTIPLE files per post(absolute file path)) --file_name
        subforum_community_post: subforum_community_post, //array of subforum and community names(each post either has subforum name, community name, or no name(null)) --name
        subforum_created: subforum_created.rows, //array of created subforums --all column names
        category_created_subforum: category_created_subforum, //2D array of categories(MULTIPLE categories per subforum) --category_name
        followed_subforum: followed_subforum, //array of followed subforums --all column names
        category_followed_subforum: category_followed_subforum, //2D array of categories(MULTIPLE categories per subforum) --category_name
        community_created: community_created, //array of created communities --all column names
        member_community: member_community, //array of member communities --all column names
        chat: chat.rows //array of chats --all column names
    }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/about', async(req, res) => {
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        client.connect()
        console.log("connection successful!");
        var sql = "INSERT INTO about";
        sql += "(about,user_id)";
        sql += "VALUES ($1, $2)";
        var params = [
            req.body.about,
            req.body.user_id
        ];

        var about = await client.query(sql, params);
    } catch (err) {
        console.log("ERROR IS:", err);
    }
});

router.post('/image', upload.single("myFile"), async(req, res) => {
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        await client.connect();
        console.log("connection successful!");

        var sql = "SELECT profile_image_name FROM users ";
        sql += "WHERE id = $1;"
        var params = [
            1 //user_id
        ];

        var image = await client.query(sql, params);

        if (image.rows[0].profile_image_name != null) {
            var old_file_name = image.rows[0].profile_image_name;
            fs.unlinkSync(process.cwd() + "/public/uploads/profileImages/" + old_file_name);
        }

        var sql = "INSERT INTO users (profile_image_name) ";
        sql += "VALUES($2) ";
        sql += "WHERE user_id = $1;"
        var params = [
            1, //user_id
            req.file.filename
        ];

        var new_image = await client.query(sql, params);
    } catch (err) {
        console.log("ERROR IS:", err);
    }

});

router.post('/qualifications', async(req, res) => { //qualifications array
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        client.connect()
        console.log("connection successful!");
        for (var i = 0; i < req.body.qualifications.length; i++) {
            var sql = "INSERT INTO qualifications";
            sql += "(qualifications,user_id)";
            sql += "VALUES ($1, $2)";
            var params = [
                req.body.qualifications,
                req.body.user_id
            ];
            var qualifications = await client.query(sql, params);
        }

    } catch (err) {
        console.log("ERROR IS:", err);
    }
});

router.post('/interests', async(req, res) => { //interests array
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        client.connect()
        console.log("connection successful!");

        for (var i = 0; i < req.body.interests.length; i++) {
            var sql = "INSERT INTO interests";
            sql += "(interests,user_id)";
            sql += "VALUES ($1, $2)";
            var params = [
                req.body.interests,
                req.body.user_id
            ];
            var interests = await client.query(sql, params);
        }
    } catch (err) {
        console.log("ERROR IS:", err);
    }

});

module.exports = router;