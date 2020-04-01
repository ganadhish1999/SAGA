/*
    post/
        /view/:post_id
        /create
        /delete
        /upvote
        /downvote
*/


const express = require('express');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();

const { connectionString } = require('../config/keys')


const storage = multer.diskStorage({
    destination: "./public/uploads/postFiles/",
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, //5mb
});


router.get('/view/:post_id', async(req, res) => { //encoding remaining
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        await client.connect();
        console.log("connection successful!");

        var sql = "SELECT * FROM post ";
        sql += "WHERE post_id = $1 ";
        sql += "AND community_id IS NULL;"; //only for non-community posts
        var params = [
            req.params.post_id
        ];
        var post = await client.query(sql, params);

        // if (result.rows.length == 0) {      //if community post
        //     res.redirect('/home');
        // } 
        // else { //render the post -- use below code}

        var sql1 = "SELECT username FROM users ";
        sql1 += "WHERE user_id = $1 ";
        var params1 = [
            Number(post.rows[0].author_id)
        ];

        var sql2 = "SELECT name FROM subforum ";
        sql2 += "WHERE subforum_id = $1 ";
        var params2 = [
            Number(post.rows[0].subforum_id)
        ];

        var sql3 = "SELECT category_name FROM category ";
        sql3 += "WHERE post_id = $1;"
        params3 = [
            Number(post.rows[0].post_id)
        ];

        var username = await client.query(sql1, params1);
        var subforum_name = await client.query(sql2, params2);
        var category = await client.query(sql3, params3); //multiple categories

        //res.render()         //pass all queries with .rows or .rows[0]
    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});


router.get(['/', '/create'], (req, res) => {
    res.sendFile(process.cwd() + '/public/index.html');
})


router.post('/create', upload.array('myFile', 10), async(req, res) => {
    res.send('hello');

    const client = new Client({ connectionString: connectionString });

    try {
        await client.connect();
        console.log("connection successful!");

        //query 1
        var sql = "INSERT INTO post";
        sql += "(title,content,timestamp,author_id)";
        sql += "VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING post_id;";
        var params = [
            req.body.title,
            req.body.content,
            Number(req.body.author_id)
            // Number(req.body.subforum_id),      
            // Number(req.body.community_id)
        ];
        var post = await client.query(sql, params);

        //query 2
        for (var i = 0; i < req.body.category.length; i++) {
            sql = "INSERT INTO category";
            sql += "(category_name, post_id) ";
            sql += "(SELECT $2, post_id FROM post ";
            sql += "WHERE post_id = $1);";
            var params = [
                Number(post.rows[0].post_id),
                req.body.category[i]
            ];
            var category = await client.query(sql, params);
        }

        //query 3
        for (var i = 0; i < req.files.length; i++) {
            sql = "INSERT INTO post_file ";
            sql += "(file_name, post_id) ";
            sql += "VALUES ($1, $2);";
            var params = [
                req.file[i].filename,
                Number(post.rows[0].post_id)
            ];
            var file = await client.query(sql, params);
        }
    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});


router.delete("/delete", async(req, res) => {
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        await client.connect()
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

        var query1 = await client.query(sql1, params);
        var query2 = await client.query(sql2, params);
        var query3 = await client.query(sql3, params);
        var query4 = await client.query(sql4, params);

    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});


router.post('/upvotes', async(req, res) => {
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        client.connect()
        console.log("connection successful!");

        var sql = "UPDATE post ";
        sql += "SET upvotes = upvotes + 1 ";
        sql += "WHERE post_id = $1;";
        var params = [
            Number(req.body.post_id)
        ];

        upvote = await client.query(sql, params);
    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});

router.post('/downvotes', async(req, res) => {
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        client.connect()
        console.log("connection successful!");

        var sql = "UPDATE post ";
        sql += "SET downvotes = downvotes + 1 ";
        sql += "WHERE post_id = $1;";
        var params = [
            Number(req.body.post_id)
        ];

        upvote = await client.query(sql, params);
    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});


module.exports = router;