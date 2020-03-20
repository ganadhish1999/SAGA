/*
    post/
        /create
        /qualifications
        /interests
*/


const express = require('express');
const { Client } = require('pg');
const router = express.Router();


var conn = 'postgres://postgres:qwerty@localhost:5432/test';


router.post(['/', '/create'], (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: conn });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            //query 1
            var sql1 = "INSERT INTO post";
            sql1 += "(title,content,timestamp,author_id,subforum_id)";
            sql1 += "VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4) RETURNING *;";
            var params1 = [
                req.body.title,
                req.body.content,
                Number(req.body.author_id)
                // Number(req.body.subforum_id),      
                // Number(req.body.community_id)
            ];
            return client.query(sql1, params1);
        })
        .then(result => {
            console.log(result.rows);
            //query 2
            var sql2 = "INSERT INTO category";
            sql2 += "(category_name, post_id) ";
            sql2 += "(SELECT $2, post_id FROM post ";
            sql2 += "WHERE post_id = $1);";
            var params2 = [
                Number(result.rows[0].post_id),
                req.body.category
            ];
            return client.query(sql2, params2);
        }).then((result) => {
            console.log(result.rows);
        })
        .catch(err => {
            console.log("error is: ", err);
        });
});


router.delete("/delete/post", (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: conn });
    client
        .connect()
        .then(() => {
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
            var sql3 = "DELETE FROM post ";
            sql3 += "WHERE post_id = $1 AND author_id = $2;";
            var params = [
                Number(req.body.post_id),
                Number(req.body.author_id)
            ];
            var query1 = client.query(sql1, params);
            var query2 = client.query(sql2, params);
            var query3 = client.query(sql3, params);
            return [query1, query2, query3];
        })
        .then(result => {
            console.log("hello");

        })
        .catch(err => {
            console.log("error is: ", err);
        });
    return res.redirect('/home');
});

module.exports = router;