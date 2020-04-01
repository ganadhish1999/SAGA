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


router.get('/', async(req, res) => {
    //display qualifications, interests, about, photo
    //list of posts, subforums, communities, chats

    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        client.connect()
        console.log("connection successful!");

        //about
        var sql = "SELECT about FROM about";
        sql += "WHERE user_id = $1";
        var params = [
            1 //user_id
        ];
        var about = await client.query(sql, params); //about text


        //qualifications
        sql = "SELECT qualifications from qualifications";
        sql += "WHERE user_id = $1";
        params = [
            1 //user_id
        ];
        var qualifications = await client.query(sql, params); //list of qualifications


        //interests
        sql = "SELECT interests from interests";
        sql += "WHERE user_id = $1";
        params = [
            1 //user_id
        ];
        var interests = await client.query(sql, params); //list of interests


        //image
        sql = "SELECT profile_image_name FROM users ";
        sql += "WHERE user_id = $1;"
        params = [
            1 //user_id
        ];
        var image = await client.query(sql, params); //image file name
        var image_src = process.cwd() + "/public/uploads/profileImages/" + image.rows[0].profile_image_name; //for img tag src


        //posts
        post_category = [];
        sql = "SELECT * FROM post ";
        sql += "WHERE author_id = $1 "
        sql += "ORDER BY timestamp DESC;"
        params = [
            1 //user_id
        ];
        var post = await client.query(sql, params); //list of posts
        //post categories
        for (var i = 0; i < post.rows.length; i++) {
            sql = "SELECT category_name FROM category ";
            sql += "WHERE post_id = $1;"
            params = [
                post.rows[i].post_id
            ]
            var category = await client.query(sql, params);
            post_category.push(category.rows); //list of categories of posts(2D array as each post has multiple categories)
        }


        //cretaed subforums
        var created_subforum_category = [];
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
                subforum_created.rows[i].subforum_id //subforum_id
            ]
            v
            var subforum_category_1 = await client.query(sql, params);
            created_subforum_category.push(subforum_category_1); //list of categories of subforums -- created(2D array as each subforum has multiple categories)
        }


        //followed subforums
        followed_subforum = [];
        followed_subforum_category = [];
        sql = "SELECT subforum_id FROM user_subforum ";
        sql += "WHERE user_id = $1;"
        params = [
            1 //user_id
        ];
        var subforum_id = await client.query(sql, params); //list of subforums_id -- followed
        for (var i = 0; i < subforum_id.rows.length; i++) {
            sql = "SELECT * FROM subforum ";
            sql += "WHERE subforum_id = $1;";
            params = [
                subforum_id.rows[i].subforum_id
            ]
            var subforum_followed = await client.query(sql, params);
            followed_subforum.push(subforum_followed.rows[0]); //list of subforums -- followed
        }
        //subforum categories
        for (var i = 0; i < post.rows.length; i++) {
            sql = "SELECT category_name FROM category ";
            sql += "WHERE subforum_id = $1;"
            params = [
                subforum_id.rows[i].subforum_id //subforum_id
            ]
            v
            var subforum_category_2 = await client.query(sql, params);
            followed_subforum_category.push(subforum_category_2.rows); //list of categories of subforums -- followed(2D array as each subforum has multiple categories)
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
        var community_id = await client.query(sql, params); //list of communities_id -- member
        for (var i = 0; i < community_id.rows.length; i++) {
            sql = "SELECT * FROM community ";
            sql += "WHERE community_id = $1;";
            params = [
                community_id.rows[i].community_id
            ]
            var community_member = await client.query(sql, params);
            member_community.push(community_member.rows[0]); //list of communities -- member
        }


        //chats
        sql = "SELECT * FROM chat ";
        sql += "WHERE user1_id = $1 OR user2_id = $1;"
        params = [
            1 //user_id
        ];
        var chat = await client.query(sql, params); //list of chats

    } catch (err) {
        console.log("ERROR IS:", err);
    }
    //render with .rows

});

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