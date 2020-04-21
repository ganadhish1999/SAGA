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
        // console.log(post.rows[0]);
        // if (result.rows.length == 0) {      //if community post
        //     res.redirect('/home');
        // }
        // else { //render the post -- use below code}

        var sql1 = "SELECT username FROM users ";
        sql1 += "WHERE user_id = $1 ";
        var params1 = [Number(post.rows[0].author_id)];

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


        var username = await pool.query(sql1, params1);
        var subforum_name = await pool.query(sql2, params2);
        var category = await pool.query(sql3, params3); //multiple categories
        var comment = await pool.query(sql4, params4); //multiple comments
        var file = await pool.query(sql5, params5);
        for (var i = 0; i < file.rows.length; i++) {
            file.rows[i].file_name = process.cwd() + "/public/uploads/postFiles/" + file.rows[i].file_name;
        }


        var child_comment = [];
        for (var i = 0; i < comment.rows.length; i++) {
            var sql5 = "SELECT * FROM child_comment ";
            sql5 += "WHERE parent_comment_id = $1;";
            params5 = [Number(comment.rows[i].comment_id)];
            var child = await pool.query(sql5, params5);
            child_comment.push(child.rows);
        }

        post.rows[0].time_of_creation = moment(post.rows[0].time_of_creation).format('MMMM Do YYYY, h:mm a');
        var data = {
            post: post.rows[0], //post --all column names
            author: username.rows[0].username, // --username
            subforum_name: subforum_name.rows[0], //--subforum_name
            categories: category.rows, //array of categories for this post
            file: file.rows, //array of filenames for this post(absolute file path) -- file_name
            comment: comment.rows, //array of comments for this post
            child_comment: child_comment, // array of child comments(MULTIPLE child comments per parent comment, indexing as per parent comment)
        };
        res.render('view-post', {
            data
        });
    } catch (err) {
        console.log("ERROR IS: ", err);
        res.send('Error');
    }
});


router.get(['/', '/create'], (req, res) => {
    // res.sendFile(process.cwd() + '/public/index.html');
    res.render('create-post', { user: req.user });
})


router.post('/create', upload.array('myFile', 10), async(req, res) => {
    res.send('hello');
    if (typeof req.user == 'undefined') {
        console.log('User not logged in');
        return;
    }
    console.log(req.body);
    const pool = new Pool({ connectionString: connectionString });

    try {
        await pool.connect();
        console.log("connection successful!");
        console.log(req.user);
        //query 1
        var sql = "INSERT INTO post";
        sql += "(title,content,time_of_creation,author_id)";
        sql += "VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING post_id;";
        var params = [
            req.body.title,
            req.body.content,
            Number(req.user.user_id)
            // Number(req.body.subforum_id),      
            // Number(req.body.community_id)
        ];
        var post = await pool.query(sql, params);
        console.log(post);
        //query 2
        if (typeof req.body.categories != 'undefined') {
            let categoriesList = req.body.categories.split(',');
            for (var i = 0; i < categoriesList.length; i++) {
                sql = "INSERT INTO category";
                sql += "(category_name, post_id) ";
                sql += "(SELECT $2, post_id FROM post ";
                sql += "WHERE post_id = $1);";
                var params = [
                    Number(post.rows[0].post_id),
                    categoriesList[i]
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
                var params = [
                    req.files[i].filename,
                    Number(post.rows[0].post_id)
                ];
                var file = await pool.query(sql, params);
            }
    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});


router.delete("/delete", async(req, res) => {
    res.send("hello");

    const pool = new Pool({ connectionString: connectionString });

    try {
        await pool.connect()
        console.log("connection successful!");

        //query 1
        var sql1 = "DELETE FROM comment ";
        sql1 += "WHERE post_id IN ";
        sql1 += "(SELECT post_id FROM post ";
        sql1 += "WHERE post_id = $1 AND author_id = $2);";

        //query 2
        var sql2 = "UPDATE category ";
        sql2 += "SET post_id = NULL WHERE post_id IN  ";
        sql2 += "(SELECT post_id FROM post ";
        sql2 += "WHERE post_id = $1 AND author_id = $2);";

        //query 3
        var sql3 = "DELETE FROM post_file ";
        sql3 += "WHERE post_id = $1 AND author_id = $2;";

        //query 4
        var sql4 = "DELETE FROM post ";
        sql4 += "WHERE post_id = $1 AND author_id = $2;";

        var params = [
            Number(req.body.post_id),
            Number(req.body.author_id)
        ];

        var query1 = await pool.query(sql1, params);
        var query2 = await pool.query(sql2, params);
        var query3 = await pool.query(sql3, params);
        var query4 = await pool.query(sql4, params);

    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});


router.post('/upvotes', async(req, res) => {
    res.send("hello");

    const pool = new Pool({ connectionString: connectionString });

    try {
        pool.connect()
        console.log("connection successful!");

        var sql = "UPDATE post ";
        sql += "SET upvotes = upvotes + 1 ";
        sql += "WHERE post_id = $1;";
        var params = [
            Number(req.body.post_id)
        ];

        upvote = await pool.query(sql, params);
    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});

router.post('/downvotes', async(req, res) => {
    res.send("hello");

    const pool = new Pool({ connectionString: connectionString });

    try {
        pool.connect()
        console.log("connection successful!");

        var sql = "UPDATE post ";
        sql += "SET downvotes = downvotes + 1 ";
        sql += "WHERE post_id = $1;";
        var params = [
            Number(req.body.post_id)
        ];

        downvote = await pool.query(sql, params);
    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});


module.exports = router;