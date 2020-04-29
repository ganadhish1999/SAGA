/*
    comment/
           /create
           /create/child
           /delete
*/

//can show only top 2 comments, the drop down -- feature

const express = require('express');
const router = express.Router();
const pool = require('../config/db');
//primary comment - has parent_comment_id = null
router.post("/create/:post_id", async(req, res) => {
    // res.send("comment created");
    console.log("inside parent_comment");
    try {
        if (typeof req.user != 'undefined') {
            var client = await pool.connect();
            console.log("connection successful!");

            var sql = "INSERT INTO comment ";
            sql += "(content,time_of_creation,author_id,post_id) ";
            sql += "VALUES ($1, CURRENT_TIMESTAMP, $2, $3);";
            var params1 = [
                req.body.comment,
                Number(req.user.user_id),
                Number(req.params.post_id),
            ];
            var comment = await client.query(sql, params1);
            client.release();
        }
    } catch (err) {
        client.release();
        console.log("ERROR IS : ", err);
    }
    var p = req.params.post_id;
    res.redirect('/post/view/' + p);
});


//secondary comment - has parent_comment_id = primary comment's comment_id
router.post("/create/child/:comment_id/:post_id", async(req, res) => { //req body should have parent comment id

    console.log("inside child_comment");
    try {
        var client = await pool.connect();
        console.log("connection successful!");
        console.log(req.params.post_id);
        console.log(req.body.child_comment);
        console.log(req.user.user_id);
        console.log(req.params.comment_id);
        sql = "INSERT INTO child_comment ";
        sql += "(content,time_of_creation,author_id,parent_comment_id) ";
        sql += "VALUES ($1, CURRENT_TIMESTAMP, $2, $3);";

        var params = [
            req.body.child_comment,
            Number(req.user.user_id),
            Number(req.params.comment_id),
        ];
        console.log(params);
        var child_comment = await client.query(sql, params);
        client.release();
    } catch (err) {
        client.release();
        console.log("ERROR IS : ", err);
    }
    var p = req.params.post_id;
    console.log(p);
    res.redirect('/post/view/' + p);
});


router.delete('/delete', async(req, res) => {

    try {
        var client = await pool.connect();
        console.log("connection successful!");

        var sql1 = "DELETE FROM child_comment WHERE parent_comment_id = $1;";

        var sql2 = "DELETE FROM comment WHERE comment_id = $1 ";
        sql2 += "AND author_id = $2;";

        var params = [
            req.body.comment_id,
            req.body.author_id
        ];

        var child_comment = await client.query(sql1, params);
        var comment = await client.query(sql2, params);
        client.release();
    } catch (err) {
        client.release();
        console.log("ERROR IS : ", err);
    }
});


router.delete("/delete/child", async(req, res) => {


    try {
        var client = await pool.connect();
        console.log("connection successful!");

        var sql = "DELETE FROM child_comment WHERE comment_id = $1 ";
        sql += "AND author_id = $2;";

        var params = [req.body.comment_id, req.body.author_id];

        var child_comment = await client.query(sql, params);
        client.release();
    } catch (err) {
        client.release();
        console.log("ERROR IS : ", err);
    }
});

router.post("/upvotes/parentcomment/:comment_id/:post_id", async(req, res) => {

    try {
        var client = await pool.connect();
        console.log("connection successful!");

        var sql = "UPDATE comment ";
        sql += "SET upvotes = upvotes + 1 ";
        sql += "WHERE comment_id = $1;";
        var params = [Number(req.params.comment_id)];

        var upvote = await client.query(sql, params);
        client.release();
        res.redirect('/post/view/' + req.params.post_id);
    } catch (err) {
        client.release();
        console.log("ERROR IS: ", err);
    }
});

router.post("/downvotes/parentcomment/:comment_id/:post_id", async(req, res) => {

    try {
        var client = await pool.connect();
        console.log("connection successful!");

        var sql = "UPDATE comment ";
        sql += "SET downvotes = downvotes + 1 ";
        sql += "WHERE comment_id = $1;";
        var params = [Number(req.params.comment_id)];

        var downvote = await client.query(sql, params);
        client.release();
        res.redirect('/post/view/' + req.params.post_id);
    } catch (err) {
        client.release();
        console.log("ERROR IS: ", err);
    }
});

router.post("/upvotes/childcomment/:comment_id/:post_id", async(req, res) => {

    try {
        var client = await pool.connect();
        console.log("connection successful!");

        var sql = "UPDATE child_comment ";
        sql += "SET upvotes = upvotes + 1 ";
        sql += "WHERE comment_id = $1;";
        var params = [Number(req.params.comment_id)];

        var upvote = await client.query(sql, params);
        client.release();
        res.redirect('/post/view/' + req.params.post_id);
    } catch (err) {
        client.release();
        console.log("ERROR IS: ", err);
    }
});

router.post("/downvotes/childcomment/:comment_id/:post_id", async(req, res) => {

    try {
        var client = await pool.connect();
        console.log("connection successful!");

        var sql = "UPDATE child_comment ";
        sql += "SET downvotes = downvotes + 1 ";
        sql += "WHERE comment_id = $1;";
        var params = [Number(req.params.comment_id)];

        var downvote = await client.query(sql, params);
        client.release();
        res.redirect('/post/view/' + req.params.post_id);
    } catch (err) {
        client.release();
        console.log("ERROR IS: ", err);
    }
});


module.exports = router;