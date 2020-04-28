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


router.get('/view/:community_name', async(req, res) => {

    const pool = new Pool({ connectionString: connectionString });

    try {
        var errors = [];

        if (typeof req.user == 'undefined') {
            // errors.push({ msg: 'You need to login to view the community.' });
            // res.render('home', { user: req.user, errors });
            var errors = [];
            errors.push({ msg: 'Please log in' })
            res.render('error-page', { error:errors[0].msg , title:"Error"});
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
                sql += "WHERE user_id = $1 AND community_id = $2;";
                var params = [
                    Number(req.user.user_id),
                    Number(communityResult.rows[0].community_id)
                ];
                var user_community = await pool.query(sql, params);

                if (user_community.rowCount != 0 || req.user.user_id == communityResult.rows[0].creator_id) {

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
                    res.render('community', { community, user: req.user , title: community.name });
                } else {
                    errors.push({ msg: 'You need to follow the community to view it.' });
                    res.render('error-page', { user: req.user, error:errors[0].msg, title: "Error" });
                    
                }
            } else {
                errors.push({ msg: 'This community does not exist.' });
                res.render('error-page', { user: req.user, error:errors[0].msg, title:"Error" });
            
            }
        }
    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});

router.get('/view/get-posts/:community_name', async(req, res) => {

    const pool = new Pool({ connectionString: connectionString });

    try {
        var client = await pool.connect();
        console.log("connection successful!");

        var sql = "SELECT community_id FROM community WHERE name = $1;";
        var params = [
            req.params.community_name
        ];
        var community_id = await client.query(sql, params);

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
            sql += "ORDER BY post_id DESC ";
            sql += "LIMIT 6;";
            var postsResult = await client.query(sql, params);

            var posts = [];

            for (var i = 0; i < postsResult.rows.length; i++) {
                let postResult = postsResult.rows[i];
                sql = "SELECT username FROM users ";
                sql += "WHERE user_id = $1 ";
                params = [
                    Number(postResult.author_id)
                ];
                var author = await client.query(sql, params);

                sql = "SELECT category_name FROM category ";
                sql += "WHERE post_id = $1;";
                params = [
                    Number(postResult.post_id)
                ];
                var categoryResults = await client.query(sql, params); //multiple categories
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
                client.release();
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
            client.release();
            res.redirect("error-page", { error:"This community does not exist" });
        }
    } catch (err) {
        client.release();
        console.log("ERROR IS: ", err);
    }
});

router.get('/create', (req, res) => {
    // res.sendFile(process.cwd() + '/public/index.html');
    var errors = [];
    errors.push({ msg: 'You need to login to create a community.' })
    if (typeof req.user == 'undefined') {
        res.render('home', { user: req.user, errors, title:"Home" });
    }
    res.render('create-community', { user: req.user, title: "Create Community" });
})

router.post('/create', async(req, res) => {
    if (typeof req.user == 'undefined') {
        console.log('User not logged in');
        return;
    }
    console.log(req.body);
    const pool = new Pool({ connectionString: connectionString });

    try {
        var client = await pool.connect();
        console.log("connection successful!");

        var sql = "INSERT INTO community";
        sql += "(name,description,time_of_creation,creator_id)";
        sql += "VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING *";
        var params = [
            req.body.community_name,
            req.body.description,
            Number(req.user.user_id)
        ];
        var community = await client.query(sql, params);

        sql = "INSERT INTO user_community(user_id, community_id) ";
        sql += "VALUES($1, $2);";
        params = [
            Number(req.user.user_id),
            Number(community.rows[0].community_id)
        ];
        var follow_community = await client.query(sql, params);
        // res.redirect("/view/" + res.body.name);
        client.release();
        res.redirect('/home');
    } catch (err) {
        client.release();
        console.log("ERROR IS : ", err);
    }
});


router.post('/request', async(req, res) => {
    console.log('[POST] in community/request');
    // console.log(req.body);

    const pool = new Pool({ connectionString: connectionString });

    try {
        if (req.user == 'undefined') {
            res.send('noone');
        } else {
            var client = await pool.connect();
            console.log("connection successful!");

            var sql = "SELECT community_id FROM community WHERE name = $1;";
            var params = [
                req.body.community_name
            ];

            var community_id = await client.query(sql, params);

            if (community_id.rowCount != 0) {
                sql = "INSERT INTO pending_requests(user_id, community_id) ";
                sql += "VALUES($1, $2);"
                params = [
                    Number(req.user.user_id),
                    Number(community_id.rows[0].community_id)
                ];
                var pending = await client.query(sql, params);
                client.release();
                res.send('req sent');
            } else {
                client.release();
                res.send("nothing");
            }
        }
    } catch (err) {
        client.release();
        console.log("ERROR IS: ", err);
    }
});


router.post('/check', async(req, res) => {
    console.log('[POST] in community/check');
    // console.log(req.body);

    const pool = new Pool({ connectionString: connectionString });

    try {
        if (req.user == 'undefined') {
            res.send('yes');
        } else {
            var client = await pool.connect();
            console.log("connection successful!");

            var sql = "SELECT community_id, creator_id FROM community WHERE name = $1;";
            var params = [
                req.body.community_name
            ];

            var community_id = await client.query(sql, params);

            if (community_id.rowCount != 0) {
                if (community_id.rows[0].creator_id == req.user.user_id) {
                    client.release();
                    res.send('yes');
                } else {
                    sql = "SELECT * FROM user_community WHERE community_id = $1 AND user_id=$2;";
                    params = [
                        Number(community_id.rows[0].community_id),
                        Number(req.user.user_id)
                    ];
                    var check = await client.query(sql, params);

                    if (check.rowCount == 0) {
                        client.release();
                        res.send('no');
                    } //not part of community
                    else {
                        client.release();
                        res.send('yes');
                    } // part of community
                }
            } else {
                client.release();
                res.send("yes");
            }
        }
    } catch (err) {
        client.release();
        console.log("ERROR IS: ", err);
    }
});

router.post("/follow/accept", async(req, res) => {
    console.log('[POST] community/follow/accept');

    const pool = new Pool({ connectionString: connectionString });

    try {
        if (req.user == 'undefined') {
            res.send('noone');
        } else {
            var client = await pool.connect();
            console.log("connection successful!");

            var sql = "SELECT community_id FROM community WHERE name=$1;";
            var params = [
                req.body.community_name
            ];
            var community_id = await client.query(sql, params);

            sql = "SELECT user_id FROM users WHERE username=$1;"
            params = [
                req.body.username
            ];
            var user_id = await client.query(sql, params);

            sql = "INSERT INTO user_community(user_id, community_id) ";
            sql += "VALUES($1, $2);";
            params = [
                Number(user_id.rows[0].user_id),
                Number(community_id.rows[0].community_id)
            ];
            var follow_community = await client.query(sql, params);

            sql = "DELETE FROM pending_requests WHERE user_id=$1 AND community_id=$2;";
            params = [
                Number(user_id.rows[0].user_id),
                Number(community_id.rows[0].community_id)
            ];
            var delete_pending = await client.query(sql, params);
            client.release();
        }
        res.send("accept");
    } catch (err) {
        client.release();
        console.log("ERROR IS : ", err);
    }
});

router.post("/follow/reject", async(req, res) => {
    console.log('[POST] community/follow/reject');


    const pool = new Pool({ connectionString: connectionString });

    try {
        if (req.user == 'undefined') {
            res.redirect('noone');
        } else {
            var client = await pool.connect();
            console.log("connection successful!");

            var sql = "SELECT community_id FROM community WHERE name=$1;";
            var params = [
                req.body.community_name
            ];
            var community_id = await client.query(sql, params);

            sql = "SELECT user_id FROM users WHERE username=$1;"
            params = [
                req.body.username
            ];
            var user_id = await client.query(sql, params);

            sql = "DELETE FROM pending_requests WHERE user_id=$1 AND community_id=$2;";
            params = [
                Number(user_id.rows[0].user_id),
                Number(community_id.rows[0].community_id)
            ];
            var delete_pending = await client.query(sql, params);
            client.release();
        }
        res.send("reject");
    } catch (err) {
        client.release();
        console.log("ERROR IS : ", err);
    }
});


router.post("/delete/:community_name", async(req, res) => {
    console.log('[POST] community/delete/' + req.params.community_name);

    const pool = new Pool({ connectionString: connectionString });

    try {
        var client = await pool.connect();
        console.log("connection successful!");

        var params = [
            req.params.community_name
        ];

        var sql = "SELECT comment_id FROM comment ";
        sql += "WHERE post_id IN ";
        sql += "(SELECT post_id FROM post ";
        sql += "WHERE community_id IN ";
        sql += "(SELECT community_id FROM community ";
        sql += "WHERE name = $1));";
        var parent_comment = await client.query(sql, params);

        for (var i = 0; i < parent_comment.rows.length; i++) {
            sql = "DELETE FROM child_comment ";
            sql += "WHERE parent_comment_id = $1;";
            var params1 = [
                Number(parent_comment.rows[i].comment_id)
            ];
            var child_comment = await client.query(sql, params1);
        }
        //query 1
        var sql1 = "DELETE FROM comment ";
        sql1 += "WHERE post_id IN ";
        sql1 += "(SELECT post_id FROM post ";
        sql1 += "WHERE community_id IN ";
        sql1 += "(SELECT community_id FROM community ";
        sql1 += "WHERE name = $1));";
        //query 2
        var sql2 = "DELETE FROM category ";
        sql2 += "WHERE post_id IN  ";
        sql2 += "(SELECT post_id FROM post ";
        sql2 += "WHERE community_id IN ";
        sql2 += "(SELECT community_id FROM community ";
        sql2 += "WHERE name = $1));";
        //query 3
        var sql3 = "DELETE FROM post_file ";
        sql3 += "WHERE post_id IN ";
        sql3 += "(SELECT post_id FROM post ";
        sql3 += "WHERE community_id IN ";
        sql3 += "(SELECT community_id FROM community ";
        sql3 += "WHERE name = $1));"
            //query 4
        var sql4 = "DELETE FROM post ";
        sql4 += "WHERE post_id IN ";
        sql4 += "(SELECT post_id FROM post ";
        sql4 += "WHERE community_id IN ";
        sql4 += "(SELECT community_id FROM community ";
        sql4 += "WHERE name = $1));"
            //query 4    
        var sql5 = "DELETE FROM user_community ";
        sql5 += "WHERE community_id IN ";
        sql5 += "(SELECT community_id FROM community ";
        sql5 += "WHERE name = $1);";
        //query 5
        var sql6 = "DELETE FROM community ";
        sql6 += "WHERE name = $1";

        var query1 = await client.query(sql1, params);
        var query2 = await client.query(sql2, params);
        var query3 = await client.query(sql3, params);
        var query4 = await client.query(sql4, params);
        var query5 = await client.query(sql5, params);
        var query6 = await client.query(sql6, params);
        client.release();
        res.redirect('/home');
    } catch (err) {
        client.release();
        console.log("ERROR IS : ", err);
    }
});


module.exports = router;