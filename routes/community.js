/*
    community/
             /create
             /follow
             /delete
*/


const express = require('express');
const { Pool } = require('pg');
const router = express.Router();
const moment = require('moment');

const { connectionString } = require("../config/keys");


router.post('/request', async(req, res) => {
    res.send('hello');
    console.log('[POST] in community/request');
    // console.log(req.body);

    const pool = new Pool({ connectionString: connectionString });

    try {
        if (req.user == 'undefined') {
            res.redirect('/home');
        } else {
            await pool.connect();
            console.log("connection successful!");

            var sql = "SELECT community_id FROM community WHERE name = $1;";
            var params = [
                req.body.community_name
            ];

            var community_id = await pool.query(sql, params);

            if (community_id.rowCount != 0) {
                sql = "INSERT INTO pending_requests(user_id, community_id) ";
                sql += "VALUES($1, $2);"
                params = [
                    Number(req.user.user_id),
                    Number(community_id.rows[0].community_id)
                ];
                var pending = await pool.query(sql, params);

            } else {
                res.redirect("/home");
            }
        }
    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});


router.post('/check', async(req, res) => {
    console.log('[POST] in community/check');
    // console.log(req.body);

    const pool = new Pool({ connectionString: connectionString });

    try {
        if (req.user == 'undefined') {
            res.redirect('/home');
        } else {
            await pool.connect();
            console.log("connection successful!");

            var sql = "SELECT community_id FROM community WHERE name = $1;";
            var params = [
                req.body.community_name
            ];

            var community_id = await pool.query(sql, params);

            if (community_id.rowCount != 0) {
                sql = "SELECT * FROM user_community WHERE community_id = $1;";
                params = [
                    Number(community_id.rows[0].community_id)
                ];
                var check = await pool.query(sql, params);

                if (check.rowCount == 0) {
                    res.send('no');
                } //not part of community
                else {
                    res.send('yes');
                } // part of community
            } else {
                res.redirect("/home");
            }
        }
    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});


router.get('/view/:community_name', async(req, res) => {

    const pool = new Pool({ connectionString: connectionString });

    try {
        if (typeof req.user == 'undefined') {
            res.redirect("/home");
        } else {
            await pool.connect();
            console.log("connection successful!");

            var sql = "SELECT community_id FROM community WHERE name = $1;";
            var params = [
                req.params.community_name
            ];

            var community_id = await pool.query(sql, params);

            if (community_id.rowCount != 0) {

                sql = "SELECT * FROM community ";
                sql += "WHERE community_id = $1;";
                params = [
                    Number(community_id.rows[0].community_id)
                ];
                var communityResult = await pool.query(sql, params);

                var sql = "SELECT * FROM user_community ";
                sql += "WHERE user_id = $1 AND community_id = $2;;";
                var params = [
                    Number(req.user.user_id),
                    Number(communityResult.rows[0].community_id)
                ];
                var user_community = await pool.query(sql, params);

                if (user_community.rowCount == 0) { res.redirect('/home'); } //if not member of community

                sql = "SELECT username FROM users ";
                sql += "WHERE user_id = $1;";
                params = [
                    Number(communityResult.rows[0].creator_id)
                ];
                var creator = await pool.query(sql, params);

                let community = {
                    name: communityResult.rows[0].name,
                    description: communityResult.rows[0].description,
                    time: moment(communityResult.rows[0].time_of_creation).format("h:mm a"),
                    date: moment(communityResult.rows[0].time_of_creation).format("MMM D, YYYY"),
                    creator_username: creator.rows[0].username
                }
                res.render('community', { community });
            } else {
                res.redirect("/home");
            }
        }
    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});

router.get('/view/get-posts/:community_name', async(req, res) => {

    const pool = new Pool({ connectionString: connectionString });

    try {
        await pool.connect();
        console.log("connection successful!");

        var sql = "SELECT community_id FROM community WHERE name = $1;";
        var params = [
            req.params.community_name
        ];
        var community_id = await pool.query(sql, params);

        if (community_id.rowCount != 0) {
            //all posts of the community
            if (typeof req.query.post_id != 'undefined') {
                console.log("query.post_id:" + req.query.post_id);
                var params = [
                    community_id.rows[0].community_id,
                    Number(req.query.post_id)
                ];
            } else {
                var params = [
                    community_id.rows[0].community_id,
                    Number.MAX_SAFE_INTEGER
                ];
            }

            sql = "SELECT * FROM post ";
            sql += "WHERE community_id = $1 AND post_id < $2 ";
            sql += "ORDER BY community_id DESC ";
            sql += "LIMIT 6;";
            var postsResult = await pool.query(sql, params);

            var posts = [];

            for (var i = 0; i < postsResult.rows.length; i++) {
                let postResult = postsResult.rows[i];
                sql = "SELECT username FROM users ";
                sql += "WHERE user_id = $1 ";
                params = [
                    Number(postResult.author_id)
                ];
                var author = await pool.query(sql, params);

                sql = "SELECT category_name FROM category ";
                sql += "WHERE post_id = $1;";
                params = [
                    Number(postResult.post_id)
                ];
                var categoryResults = await pool.query(sql, params); //multiple categories
                var categoriesList = ''
                categoryResults.rows.forEach(categoryResult => {
                    categoriesList += categoryResult.category_name + ',';
                });

                // sql = "SELECT file_name FROM post_file ";
                // sql += "WHERE post_id = $1;";
                // params = [
                //     Number(postResult.post_id)
                // ];
                // var file_temp = await pool.query(sql, params); //multiple files per post
                // for (var i = 0; i < file_temp.rows.length; i++) {
                //     file_temp.rows[i].file_name = process.cwd() + "/public/uploads/postFiles/" + file_temp.rows[i].file_name;
                // }
                // file.push(file_temp.rows);

                let post = {
                    post_id: postResult.post_id,
                    title: postResult.title,
                    content: postResult.content.substring(0, 100) + "...",
                    time: moment(postResult.time_of_creation).format("h:mm a"),
                    date: moment(postResult.time_of_creation).format("MMM D, YYYY"),
                    upvotes: postResult.upvotes,
                    downvotes: postResult.downvotes,
                    author_username: author.rows[0].username,
                    categoriesList,
                }
                posts.push(post);
            }

            var data;
            if (posts.length == 0) {
                data = {};
            } else {
                data = { posts, last_post_id: posts[posts.length - 1].post_id };
            }
            res.json(data);
        } else {
            res.redirect("/home");
        }
    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});


router.post(['/', '/create'], async(req, res) => {
    res.send("hello");

    const pool = new Pool({ connectionString: connectionString });

    try {
        await pool.connect();
        console.log("connection successful!");

        var sql = "INSERT INTO community";
        sql += "(name,description,timestamp,creator_id)";
        sql += "VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING *";
        var params = [
            req.body.name,
            req.body.description,
            Number(req.user.user_id)
        ];
        var community = await pool.query(sql, params);
    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});


router.post("/follow", async(req, res) => {
    res.send("hello");

    const pool = new Pool({ connectionString: connectionString });

    try {
        await pool.connect();
        console.log("connection successful!");

        var sql = "INSERT INTO user_community ";
        sql += "(SELECT $2, community_id FROM community ";
        sql += "WHERE name=$1);";
        var params = [
            req.body.name,
            Number(req.body.user_id)
        ];
        var follow_community = await pool.query(sql, params);
    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});


router.delete("/delete", async(req, res) => {
    res.send("hello");

    const pool = new Pool({ connectionString: connectionString });

    try {
        await pool.connect();
        console.log("connection successful!");

        //query 1
        var sql1 = "DELETE FROM comment ";
        sql1 += "WHERE post_id IN ";
        sql1 += "(SELECT post_id FROM post ";
        sql1 += "WHERE community_id IN ";
        sql1 += "(SELECT community_id FROM community ";
        sql1 += "WHERE community_id = $1 AND creator_id = $2));";
        //query 2
        var sql2 = "UPDATE category ";
        sql2 += "SET post_id = NULL WHERE post_id IN  ";
        sql2 += "(SELECT post_id FROM post ";
        sql2 += "WHERE community_id IN ";
        sql2 += "(SELECT community_id FROM community ";
        sql2 += "WHERE community_id = $1 AND creator_id = $2));";
        //query 3
        var sql3 = "DELETE FROM post_file ";
        sql3 += "WHERE post_id IN ";
        sql3 += "(SELECT post_id FROM post ";
        sql3 += "WHERE community_id IN ";
        sql3 += "(SELECT community_id FROM community ";
        sql3 += "WHERE community_id = $1 AND creator_id = $2));"
            //query 4
        var sql4 = "DELETE FROM post ";
        sql4 += "WHERE post_id IN ";
        sql4 += "(SELECT post_id FROM post ";
        sql4 += "WHERE community_id IN ";
        sql4 += "(SELECT community_id FROM community ";
        sql4 += "WHERE community_id = $1 AND creator_id = $2));"
            //query 4    
        var sql5 = "DELETE FROM user_community ";
        sql5 += "WHERE community_id IN ";
        sql5 += "(SELECT community_id FROM community ";
        sql5 += "WHERE community_id = $1 AND creator_id = $2);";
        //query 5
        var sql6 = "DELETE FROM community ";
        sql6 += "WHERE community_id = $1 AND creator_id = $2;";
        var params = [
            Number(req.body.community_id),
            Number(req.body.creator_id)
        ];
        var query1 = await pool.query(sql1, params);
        var query2 = await pool.query(sql2, params);
        var query3 = await pool.query(sql3, params);
        var query4 = await pool.query(sql4, params);
        var query5 = await pool.query(sql5, params);
        var query6 = await pool.query(sql6, params);
    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});


module.exports = router;