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


var conn = 'postgres://postgres:qwerty@localhost:5432/test';

//primary comment - has parent_comment_id = null
router.post("/create", (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: conn });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            var sql = "INSERT INTO comment ";
            sql += "(content,timestamp,author_id,post_id) ";
            sql += "VALUES ($1, CURRENT_TIMESTAMP, $2, $3);";
            var params = [
                req.body.content,
                Number(req.body.author_id),
                Number(req.body.post_id)
            ];
            return client.query(sql, params);
        })
        .then((result) => {
            console.log("result: ", result.rows);
        })
        .catch((err) => {
            console.log("error is: ", err);
        });
});


//secondary comment - has parent_comment_id = primary comment's comment_id
router.post("/create/child", (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: conn });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            var sql1 = "SELECT * FROM comment ";
            sql1 += "WHERE comment_id = $1;";
            var params1 = [
                Number(req.body.comment_id) //comment_id of upper comment
            ];
            return client.query(sql1, params1);
        })
        .then((result) => {
            var sql2 = "INSERT INTO comment ";
            sql2 += "(content,timestamp,author_id,post_id,parent_comment_id) ";
            sql2 += "VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4);";
            if (result.rows[0].parent_comment_id == null) {
                var params2 = [
                    req.body.content,
                    Number(req.body.author_id),
                    Number(req.body.post_id),
                    Number(result.rows[0].comment_id)
                ];
                console.log("reached here");
                return client.query(sql2, params2);
            } else {
                var params2 = [
                    req.body.content,
                    Number(req.body.author_id),
                    Number(req.body.post_id),
                    Number(result.rows[0].parent_comment_id)
                ];
                return client.query(sql2, params2);
            }

        })
        .then((result) => {
            console.log("result: ", result.rows);
        })
        .catch((err) => {
            console.log("error is: ", err);
        });
});




router.delete('/delete', (req, res) => {
    res.send("hello");
    console.log("post body: ", req.body);
    const client = new Client({ connectionString: conn });
    client
        .connect()
        .then(() => {
            var sql = "DELETE FROM comment WHERE comment_id = $1 ";
            sql += "AND author_id = $2;"
            var params = [
                req.body.comment_id,
                req.body.author_id
            ];
            return client.query(sql, params);
        })
        .then((result) => {
            console.log(result.rows);
        })
        .catch((err) => {
            console.log("error is :", err);
        })
});



module.exports = router;