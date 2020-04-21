/*
    comment/
           /create
           /create/child
           /delete
*/

//can show only top 2 comments, the drop down -- feature

const express = require('express');
const { Pool } = require('pg');
const router = express.Router();


const { connectionString } = require("../config/keys");

//primary comment - has parent_comment_id = null
router.post("/create", async(req, res) => {
    res.send("hello");

    const pool = new Pool({ connectionString: connectionString });

    try {
        await pool.connect();
        console.log("connection successful!");
        var sql = "INSERT INTO comment ";
        sql += "(content,timestamp,author_id,post_id) ";
        sql += "VALUES ($1, CURRENT_TIMESTAMP, $2, $3);";
        var params = [
            req.body.content,
            Number(req.body.author_id),
            Number(req.body.post_id),
        ];
        var comment = await pool.query(sql, params);
    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});


//secondary comment - has parent_comment_id = primary comment's comment_id
router.post("/create/child", async(req, res) => { //req body should have parent comment id
    res.send("hello");

    const pool = new Pool({ connectionString: connectionString });

    try {
        await pool.connect();
        console.log("connection successful!");

        sql = "INSERT INTO child_comment ";
        sql += "(content,timestamp,author_id,parent_comment_id) ";
        sql += "VALUES ($1, CURRENT_TIMESTAMP, $2, $3);";

        var params = [
            req.body.content,
            Number(req.body.author_id),
            req.body.comment_id,
        ];

        var child_comment = await pool.query(sql, params);

    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});


router.delete('/delete', async(req, res) => {
    res.send("hello");

    const pool = new Pool({ connectionString: connectionString });

    try {
        await pool.connect();
        console.log("connection successful!");

        var sql1 = "DELETE FROM child_comment WHERE parent_comment_id = $1;";

        var sql2 = "DELETE FROM comment WHERE comment_id = $1 ";
        sql2 += "AND author_id = $2;";

        var params = [
            req.body.comment_id,
            req.body.author_id
        ];

        var child_comment = await pool.query(sql1, params);
        var comment = await pool.query(sql2, params);

    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});


router.delete("/delete/child", async(req, res) => {
    res.send("hello");

    const pool = new Pool({ connectionString: connectionString });

    try {
        await pool.connect();
        console.log("connection successful!");

        var sql = "DELETE FROM child_comment WHERE comment_id = $1 ";
        sql += "AND author_id = $2;";

        var params = [req.body.comment_id, req.body.author_id];

        var child_comment = await pool.query(sql, params);
    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});

router.post("/upvotes/comment", async(req, res) => {
    res.send("hello");

    const pool = new Pool({ connectionString: connectionString });

    try {
        pool.connect();
        console.log("connection successful!");

        var sql = "UPDATE comment ";
        sql += "SET upvotes = upvotes + 1 ";
        sql += "WHERE comment_id = $1;";
        var params = [Number(req.body.comment_id)];

        upvote = await pool.query(sql, params);
    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});

router.post("/downvotes/comment", async(req, res) => {
    res.send("hello");

    const pool = new Pool({ connectionString: connectionString });

    try {
        pool.connect();
        console.log("connection successful!");

        var sql = "UPDATE comment ";
        sql += "SET downvotes = downvotes + 1 ";
        sql += "WHERE comment_id = $1;";
        var params = [Number(req.body.comment_id)];

        downvote = await pool.query(sql, params);
    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});

router.post("/upvotes/childcomment", async(req, res) => {
    res.send("hello");

    const pool = new Pool({ connectionString: connectionString });

    try {
        pool.connect();
        console.log("connection successful!");

        var sql = "UPDATE child_comment ";
        sql += "SET upvotes = upvotes + 1 ";
        sql += "WHERE child_comment_id = $1;";
        var params = [Number(req.body.child_comment_id)];

        upvote = await pool.query(sql, params);
    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});

router.post("/downvotes/childcomment", async(req, res) => {
    res.send("hello");

    const pool = new Pool({ connectionString: connectionString });

    try {
        pool.connect();
        console.log("connection successful!");

        var sql = "UPDATE child_comment ";
        sql += "SET downvotes = downvotes + 1 ";
        sql += "WHERE child_comment_id = $1;";
        var params = [Number(req.body.child_comment_id)];

        downvote = await pool.query(sql, params);
    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});


module.exports = router;