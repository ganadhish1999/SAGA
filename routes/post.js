/*
    post/
        /view/:post_id
        /create
        /delete
        /upvote
        /downvote
*/


const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const moment = require('moment');

const {
    connectionString
} = require('../config/keys')


const storage = multer.diskStorage({
    destination: "./public/uploads/postFiles/",
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    }, //5mb
});


router.get('/view/:post_id', async(req, res) => { //encoding remaining
    // res.send("hello");

    const pool = new Pool({ connectionString: connectionString });

    try {
        await pool.connect();
        console.log("connection successful!");

        var sql = "SELECT * FROM post ";
        sql += "WHERE post_id = $1 ";
        sql += "AND community_id IS NULL;"; //only for non-community posts
        var params = [req.params.post_id];
        var post = await pool.query(sql, params);

        if (post.rows.length == 0) { //if community post
            res.redirect('/home');
        } else {

            var sql1 = "SELECT username FROM users ";
            sql1 += "WHERE user_id = $1 ";
            var params1 = [Number(post.rows[0].author_id)];
            var username = await pool.query(sql1, params1);

            //image
            sql = "SELECT profile_image_name FROM users ";
            sql += "WHERE username = $1;";
            params = [
                username.rows[0].username
            ];
            var profile_image = await pool.query(sql, params); //image file name

            if (profile_image.rows[0].profile_image_name != null) {
                var profile_image_src_main = "/../uploads/profileImages/" + profile_image.rows[0].profile_image_name; //for img tag src 
            } else {
                var profile_image_src_main = "/../uploads/profileImages/default.png"; //for img tag src 
            }

            var sql2 = "SELECT name FROM subforum ";
            sql2 += "WHERE subforum_id = $1 ";
            var params2 = [Number(post.rows[0].subforum_id)];

            var sql3 = "SELECT category_name FROM category ";
            sql3 += "WHERE post_id = $1;";
            var params3 = [Number(post.rows[0].post_id)];

            var sql4 = "SELECT * FROM comment ";
            sql4 += "WHERE post_id = $1 ";
            sql4 += "ORDER BY time_of_creation DESC;";
            var params4 = [Number(post.rows[0].post_id)];

            var sql5 = "SELECT file_name FROM post_file ";
            sql5 += "WHERE post_id = $1;";
            var params5 = [Number(post.rows[0].post_id)];



            var subforum_name = await pool.query(sql2, params2);
            var comment = await pool.query(sql4, params4);
            var categoryResults = await pool.query(sql3, params3);
            var categoriesList = []
            categoryResults.rows.forEach(categoryResult => {
                categoriesList.push(categoryResult.category_name);
            });
            var file = await pool.query(sql5, params5);
            for (var i = 0; i < file.rows.length; i++) {
                file.rows[i].file_name = process.cwd() + "/public/uploads/postFiles/" + file.rows[i].file_name;
            }

            var child_comment = [];
            for (var i = 0; i < comment.rows.length; i++) {
                sql = "SELECT * FROM child_comment ";
                sql += "WHERE parent_comment_id = $1;";
                params = [Number(comment.rows[i].comment_id)];

                var child = await pool.query(sql, params);

                for (var j = 0; j < child.rows.length; j++) {
                    sql = "SELECT username, profile_image_name FROM users ";
                    sql += "WHERE user_id = $1;";
                    params = [Number(child.rows[j].author_id)];

                    var user5 = await pool.query(sql, params);

                    if (user5.rows[0].profile_image_name != null) {
                        var profile_image_src = "/../uploads/profileImages/" + user5.rows[0].profile_image_name; //for img tag src 
                    } else {
                        var profile_image_src = "/../uploads/profileImages/default.png"; //for img tag src 
                    }
                    // console.log(profile_image_src);

                    child.rows[j].username = user5.rows[0].username;
                    child.rows[j].profile = profile_image_src;
                }
                // console.log(child.rows);
                child_comment.push(child.rows);
            }

            for (var i = 0; i < comment.rows.length; i++) {
                var sql6 = "SELECT username, profile_image_name FROM users ";
                sql6 += "WHERE user_id = $1;";
                params6 = [Number(comment.rows[i].author_id)];
                var user3 = await pool.query(sql6, params6);

                if (user3.rows[0].profile_image_name != null) {
                    var profile_image_src = "/../uploads/profileImages/" + user3.rows[0].profile_image_name; //for img tag src 
                } else {
                    var profile_image_src = "/../uploads/profileImages/default.png"; //for img tag src 
                }

                comment.rows[i].username = user3.rows[0].username;
                comment.rows[i].profile = profile_image_src;

            }

            console.log(comment.rows[0]);
            var data = {
                post: post.rows[0], //post --all column names
                author_username: username.rows[0].username, // --username
                profile_image_src: profile_image_src_main,
                subforum_name: subforum_name.rows[0], //--subforum_name
                categoriesList,
                file: file.rows, //array of filenames for this post(absolute file path) -- file_name
                comment: comment.rows, //array of comments for this post
                child_comment: child_comment, // array of child comments(MULTIPLE child comments per parent comment, indexing as per parent comment)
                post_id: req.params.post_id,
            };


            res.render('view-post', {
                data,
                user: req.user,
                title: post.rows[0].title
            });

        }
    } catch (err) {
        console.log("ERROR IS: ", err);
        res.send('Error');
    }
});


router.get('/create', (req, res) => {
    // res.sendFile(process.cwd() + '/public/index.html');
    var errors = [];
    errors.push({ msg: 'You need to login to create a post.' })
    if (typeof req.user == 'undefined') {
        res.render('error-page', { error: errors[0] });
    }
    res.render('create-post', { user: req.user });
});

router.get('/create/for-subforum/:subforum_name', (req, res) => {
    // res.sendFile(process.cwd() + '/public/index.html');
    var errors = [];
    errors.push({ msg: 'You need to login to create a post.' })
    if (typeof req.user == 'undefined') {
        res.render('error-page', { error: errors[0] });
    }
    res.render('create-post', { user: req.user, subforum_name: req.params.subforum_name });
});

router.get('/create/for-community/:community_name', (req, res) => {
    // res.sendFile(process.cwd() + '/public/index.html');
    var errors = [];
    errors.push({ msg: 'You need to login to create a post.' })
    if (typeof req.user == 'undefined') {
        res.render('error-page', { error: errors[0] });
    }
    res.render('create-post', { user: req.user, community_name: req.params.community_name });
});


router.post('/create/:subforum_name/:community_name', upload.array('myFile', 10), async(req, res) => {

    if (typeof req.user == 'undefined') {
        console.log('User not logged in');
        return;
    }

    const pool = new Pool({ connectionString: connectionString });

    try {
        await pool.connect();
        console.log("connection successful!");
        // console.log(req.user);

        if (req.params.subforum_name != 'no') {
            var sql = "SELECT subforum_id FROM subforum WHERE name = $1;";
            var params = [
                req.params.subforum_name
            ];
            var subforum_id = await pool.query(sql, params);

            sql = "INSERT INTO post";
            sql += "(title,content,time_of_creation,author_id, subforum_id)";
            sql += "VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4) RETURNING post_id;";
            params = [
                req.body.title,
                req.body.content,
                Number(req.user.user_id),
                Number(subforum_id.rows[0].subforum_id)
            ];
        } else if (req.params.community_name != 'no') {
            var sql = "SELECT community_id FROM community WHERE name = $1;";
            var params = [
                req.params.community_name
            ];
            var community_id = await pool.query(sql, params);

            sql = "INSERT INTO post";
            sql += "(title,content,time_of_creation,author_id, community_id)";
            sql += "VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4) RETURNING post_id;";
            params = [
                req.body.title,
                req.body.content,
                Number(req.user.user_id),
                Number(community_id.rows[0].community_id)
            ];
        } else {

            var sql = "INSERT INTO post";
            sql += "(title,content,time_of_creation,author_id)";
            sql += "VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING post_id;";
            var params = [
                req.body.title,
                req.body.content,
                Number(req.user.user_id)
            ];

        }
        //query 1
        var post = await pool.query(sql, params);

        //query 2
        if (typeof req.body.categories != 'undefined') {
            let categoriesList = req.body.categories.split(',');
            for (var i = 0; i < categoriesList.length; i++) {
                sql = "INSERT INTO category";
                sql += "(category_name, post_id) ";
                sql += "VALUES($1, $2);"
                params = [
                    categoriesList[i],
                    Number(post.rows[0].post_id),
                ];
                var category = await pool.query(sql, params);
            }
        }

        //query 3
        if (typeof req.files != 'undefined')
            for (var i = 0; i < req.files.length; i++) {
                sql = "INSERT INTO post_file ";
                sql += "(file_name, post_id) ";
                sql += "VALUES ($1, $2);";
                params = [
                    req.files[i].filename,
                    Number(post.rows[0].post_id)
                ];
                var file = await pool.query(sql, params);
            }
        res.redirect('/home');
    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});


router.post("/delete/:post_id", async(req, res) => {

    const pool = new Pool({ connectionString: connectionString });

    try {
        await pool.connect()
        console.log("connection successful!");

        var params = [
            Number(req.params.post_id)
        ];

        var sql = "SELECT comment_id FROM comment ";
        sql += "WHERE post_id = $1;";
        var parent_comment = await pool.query(sql, params);

        for (var i = 0; i < parent_comment.rows.length; i++) {
            sql = "DELETE FROM child_comment ";
            sql += "WHERE parent_comment_id = $1;";
            var params1 = [
                Number(parent_comment.rows[i].comment_id)
            ];
            var child_comment = await pool.query(sql, params1);
        }

        //query 1
        var sql1 = "DELETE FROM comment ";
        sql1 += "WHERE post_id = $1;";

        //query 2
        var sql2 = "DELETE FROM category ";
        sql2 += "WHERE post_id = $1;";

        //query 3
        var sql3 = "DELETE FROM post_file ";
        sql3 += "WHERE post_id = $1;";

        //query 4
        var sql4 = "DELETE FROM post ";
        sql4 += "WHERE post_id = $1;";



        var query1 = await pool.query(sql1, params);
        var query2 = await pool.query(sql2, params);
        var query3 = await pool.query(sql3, params);
        var query4 = await pool.query(sql4, params);

        res.redirect('/home');
    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});


router.post('/upvotes/:post_id', async(req, res) => {

    const pool = new Pool({ connectionString: connectionString });

    try {
        pool.connect()
        console.log("connection successful!");
        if(req.user == undefined) {
            throw Error('User is not logged in');
        }
        console.log('req.user:');
        console.log(req.user);
        var sql = "UPDATE post ";
        sql += "SET upvotes = upvotes + 1 ";
        sql += "WHERE post_id = $1;";
        var params = [
            Number(req.params.post_id)
        ];

        upvote = await pool.query(sql, params);
        res.json({msg: 'OK'});
    } catch (err) {
        res.json({msg: err});
        console.log("ERROR IS: ", err);
    }
});

router.post('/downvotes/:post_id', async(req, res) => {

    const pool = new Pool({ connectionString: connectionString });

    try {
        pool.connect()
        console.log("connection successful!");
        if(req.user == undefined) {
            throw Error('User is not logged in');
        }
        var sql = "UPDATE post ";
        sql += "SET downvotes = downvotes + 1 ";
        sql += "WHERE post_id = $1;";
        var params = [
            Number(req.params.post_id)
        ];

        downvote = await pool.query(sql, params);
        res.json({msg: 'OK'});
    } catch (err) {
        res.json({msg:err});
        console.log(err);
    }
});


module.exports = router;