/*
    subforum/
            /create
            /follow
            /delete
*/


const express = require('express');
const { Client } = require('pg');
const router = express.Router();


const { connectionString } = require("../config/keys");



router.get('/view/:subforum_id', async(req, res) => {
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        await client.connect();
        console.log("connection successful!");

        var author_post = [];
        var category_post = [];

        //all posts of the subforum
        if (req.query) {
            var sql1 = "SELECT COUNT(*) FROM subforum ";
            sql1 += "WHERE subforum_id >= $1;";
            var params1 = [
                req.query.subforum_id
            ];
            var count = await client.query(sql1, params1);

            sql1 = "SELECT * FROM post ";
            sql1 += "WHERE subforum_id = $1 ";
            sql1 += "ORDER BY subforum_id DESC";
            sql1 += "LIMIT 6 OFFSET $2;";
            params1 = [
                req.params.subforum_id, count.rows[0].count
            ];
            var post = await client.query(sql1, params1);

            for (var i = 0; i < post.rows.length; i++) {
                var sql2 = "SELECT username FROM users ";
                sql2 += "WHERE user_id = $1 ";
                var params2 = [
                    Number(post.rows[i].author_id)
                ];

                var sql3 = "SELECT category_name FROM category ";
                sql3 += "WHERE post_id = $1;";
                var params3 = [
                    Number(post.rows[i].post_id)
                ];

                var username = await client.query(sql2, params2);
                author_post.push(username.rows[0]);
                var category = await client.query(sql3, params3); //multiple categories
                category_post.push(category.rows);
            }
            var data = {
                post: post.rows, //array of posts --all column names
                author: author_post, //array of authors --username
                category_post: category_post, //2D array of categories(multiple categories per post) -- category_name
            };
        } else {
            var sql = "SELECT * FROM subforum ";
            sql += "WHERE subforum_id = $1;";
            var params = [
                req.params.subforum_id
            ];
            var subforum = await client.query(sql, params);

            sql = "SELECT username FROM users ";
            sql += "WHERE user_id = $1;";
            params = [
                subforum.rows[0].creator_id
            ];
            var creator = await client.query(sql, params);

            sql = "SELECT category_name FROM category ";
            sql += "WHERE subforum_id = $1;";
            var params = [
                req.params.subforum_id
            ];
            var category_subforum = await client.query(sql, params); //multiple categories

            var sql1 = "SELECT * FROM post ";
            sql1 += "WHERE subforum_id = $1 ";
            sql1 += "ORDER BY subforum_id DESC LIMIT 6;";
            params1 = [
                req.params.subforum_id
            ];
            var post = await client.query(sql1, params1);

            for (var i = 0; i < post.rows.length; i++) {
                var sql2 = "SELECT username FROM users ";
                sql2 += "WHERE user_id = $1 ";
                var params2 = [
                    Number(post.rows[i].author_id)
                ];

                var sql3 = "SELECT category_name FROM category ";
                sql3 += "WHERE post_id = $1;";
                var params3 = [
                    Number(post.rows[i].post_id)
                ];

                var username = await client.query(sql2, params2);
                author_post.push(username.rows[0]);
                var category_post = await client.query(sql3, params3); //multiple categories
                category_post.push(category_post.rows);

                var data = {
                    post: post.rows, //array of posts --all column names
                    author: author_post, //array of authors --username
                    category_post: category_post, //2D array of categories(multiple categories per post) --category_name
                    subforum: subforum.rows[0], // --all column names
                    creator: creator.rows[0], // --username
                    category_subforum: category_subforum, //2D array of categories(multiple categories per subforum) --category_name
                };
            }
        }
    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});



router.post(['/', '/create'], async(req, res) => {
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        await client.connect();
        console.log("connection successful!");

        //query 1
        var sql = "INSERT INTO subforum";
        sql += "(name,description,timestamp,creator_id)";
        sql += "VALUES ($1, $2, CURRENT_TIMESTAMP, $3); ";
        var params = [
            req.body.name,
            req.body.description,
            Number(req.body.creator_id)
        ];
        var subforum = await client.query(sql, params);

        //query 2
        for (var i = 0; i < req.body.category.length; i++) {
            sql = "INSERT INTO category";
            sql += "(category_name, subforum_id) ";
            sql += "(SELECT $2, subforum_id FROM subforum ";
            sql += "WHERE name = $1);"
            var params = [
                req.body.name,
                req.body.category[i]
            ];
            var category = await client.query(sql, params);
        }
    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});


router.post("/follow", async(req, res) => {
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        await client.connect();
        console.log("connection successful!");

        var sql = "INSERT INTO user_subforum ";
        sql += "(SELECT $2, subforum_id FROM subforum ";
        sql += "WHERE name=$1);";
        var params = [req.body.name, Number(req.body.user_id)];
        var follow_subforum = await client.query(sql, params);
    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});

router.delete("/delete", async(req, res) => {
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        await client.connect();
        console.log("connection successful!");

        //query 1
        var sql1 = "DELETE FROM comment ";
        sql1 += "WHERE post_id IN ";
        sql1 += "(SELECT post_id FROM post ";
        sql1 += "WHERE subforum_id IN ";
        sql1 += "(SELECT subforum_id FROM subforum ";
        sql1 += "WHERE subforum_id = $1 AND creator_id = $2));";
        //query 2
        var sql2 = "UPDATE category ";
        sql2 += "SET post_id = NULL WHERE post_id IN  ";
        sql2 += "(SELECT post_id FROM post ";
        sql2 += "WHERE subforum_id IN ";
        sql2 += "(SELECT subforum_id FROM subforum ";
        sql2 += "WHERE subforum_id = $1 AND creator_id = $2));";
        //query 3
        var sql3 = "DELETE FROM post_file ";
        sql3 += "WHERE post_id IN ";
        sql3 += "(SELECT post_id FROM post ";
        sql3 += "WHERE subforum_id IN ";
        sql3 += "(SELECT subforum_id FROM subforum ";
        sql3 += "WHERE subforum_id = $1 AND creator_id = $2));"
            //query 4
        var sql4 = "DELETE FROM post ";
        sql4 += "WHERE post_id IN ";
        sql4 += "(SELECT post_id FROM post ";
        sql4 += "WHERE subforum_id IN ";
        sql4 += "(SELECT subforum_id FROM subforum ";
        sql4 += "WHERE subforum_id = $1 AND creator_id = $2));"
            //query 5    
        var sql5 = "DELETE FROM user_subforum ";
        sql5 += "WHERE subforum_id IN ";
        sql5 += "(SELECT subforum_id FROM subforum ";
        sql5 += "WHERE subforum_id = $1 AND creator_id = $2);";
        //query 6
        var sql5 = "UPDATE category ";
        sql6 += "SET subforum_id = NULL WHERE subforum_id IN  ";
        sql6 += "(SELECT subforum_id FROM subforum ";
        sql6 += "WHERE subforum_id = $1 AND creator_id = $2);";
        //query 7
        var sql7 = "DELETE FROM subforum ";
        sql7 += "WHERE subforum_id = $1 AND creator_id = $2;";
        var params = [
            Number(req.body.subforum_id),
            Number(req.body.creator_id)
        ];
        var query1 = await client.query(sql1, params);
        var query2 = await client.query(sql2, params);
        var query3 = await client.query(sql3, params);
        var query4 = await client.query(sql4, params);
        var query5 = await client.query(sql5, params);
        var query6 = await client.query(sql6, params);
        var query7 = await client.query(sql7, params);
    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});


module.exports = router;