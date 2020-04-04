/*
    comment/
           /create
           /create/child
           /delete
*/

//can show only top 2 comments, the drop down -- feature

const express = require('express');
const { Client } = require('pg');
const router = express.Router();


const { connectionString } = require("../config/keys");

//primary comment - has parent_comment_id = null
router.post("/create", async(req, res) => {
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        await client.connect();
        console.log("connection successful!");
        var sql = "INSERT INTO comment ";
        sql += "(content,timestamp,author_id,post_id) ";
        sql += "VALUES ($1, CURRENT_TIMESTAMP, $2, $3);";
        var params = [
            req.body.content,
            Number(req.body.author_id),
            Number(req.body.post_id),
        ];
        var comment = await client.query(sql, params);
    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});


//secondary comment - has parent_comment_id = primary comment's comment_id
router.post("/create/child", async(req, res) => {
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        await client.connect();
        console.log("connection successful!");

        var sql = "SELECT * FROM comment ";
        sql += "WHERE comment_id = $1;";
        var params = [
            Number(req.body.comment_id), //comment_id of upper comment
        ];

        var parent_comment = await client.query(sql, params);

        sql = "INSERT INTO comment ";
        sql += "(content,timestamp,author_id,post_id,parent_comment_id) ";
        sql += "VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4);";

        if (parent_comment.rows[0].parent_comment_id == null) {
            var params = [
                req.body.content,
                Number(req.body.author_id),
                Number(req.body.post_id),
                Number(parent_comment.rows[0].comment_id),
            ];

            var child_comment = await client.query(sql, params);
        } else {
            var params2 = [
                req.body.content,
                Number(req.body.author_id),
                Number(req.body.post_id),
                Number(parent_comment.rows[0].parent_comment_id),
            ];

            var child_comment = await client.query(sql2, params);
        }
    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});




router.delete('/delete', async(req, res) => {
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        await client.connect();
        console.log("connection successful!");

        var sql = "DELETE FROM comment WHERE comment_id = $1 ";
        sql += "AND author_id = $2;";
        var params = [req.body.comment_id, req.body.author_id];
        var comment = await client.query(sql, params);
    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});



module.exports = router;