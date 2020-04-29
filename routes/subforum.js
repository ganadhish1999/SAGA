/*
    subforum/
            /create
            /follow
            /delete
*/


const express = require('express');
const router = express.Router();
const moment = require('moment');
const pool = require('../config/db');

router.get('/view/:subforum_name', async(req, res) => {

    console.log(req.params.subforum_name);
    try {
        var errors = [];
        var client = await pool.connect();
        console.log("connection successful!");

        var sql = "SELECT subforum_id FROM subforum WHERE name = $1;";
        var params = [
            req.params.subforum_name
        ];
        var subforum_id = await client.query(sql, params);

        if (subforum_id.rowCount != 0) {
            sql = "SELECT * FROM subforum ";
            sql += "WHERE subforum_id = $1;";
            params = [
                Number(subforum_id.rows[0].subforum_id)
            ];
            var subforumResult = await client.query(sql, params);

            sql = "SELECT username FROM users ";
            sql += "WHERE user_id = $1;";
            params = [
                Number(subforumResult.rows[0].creator_id)
            ];
            var creator = await client.query(sql, params);

            sql = "SELECT category_name FROM category ";
            sql += "WHERE subforum_id = $1;";
            params = [
                Number(subforum_id.rows[0].subforum_id)
            ];
            var categoryResults = await client.query(sql, params); //multiple categories
            var categoriesList = []
            categoryResults.rows.forEach(categoryResult => {
                console.log(categoryResult);
                categoriesList.push(categoryResult.category_name);
            });

            let subforum = {
                name: subforumResult.rows[0].name,
                description: subforumResult.rows[0].description,
                time: moment(subforumResult.rows[0].time_of_creation).format("h:mm a"),
                date: moment(subforumResult.rows[0].time_of_creation).format("MMM D, YYYY"),
                creator_username: creator.rows[0].username,
                categoriesList,
            };
            client.release();
            res.render('subforum', { subforum, user: req.user });
        } else {
            // errors.push({ msg: 'No such subforum exists.' });
            // res.render('home', { user: req.user, errors });
            client.release();
            res.redirect('/home');
        }
    } catch (err) {
        client.release();
        console.log("ERROR IS: ", err);
    }
});

//query string should have post_id of last post displayed
router.get('/view/get-posts/:subforum_name', async(req, res) => {
    console.log('[GET]: /view/get-posts/' + req.params.subforum_name);
    try {
        var client = await pool.connect();
        console.log("connection successful!");

        var sql = "SELECT subforum_id FROM subforum WHERE name = $1;";
        var params = [
            req.params.subforum_name
        ];
        var subforum_id = await client.query(sql, params);

        if (subforum_id.rowCount != 0) { //else rediect somewhere
            //all posts of the subforum
            if (typeof req.query.post_id != 'undefined') {
                console.log("query.post_id:" + req.query.post_id);
                var params = [
                    subforum_id.rows[0].subforum_id,
                    Number(req.query.post_id)
                ];
            } else {
                var params = [
                    subforum_id.rows[0].subforum_id,
                    Number.MAX_SAFE_INTEGER,
                ];
            }
            sql = "SELECT * FROM post ";
            sql += "WHERE subforum_id = $1 AND post_id < $2 ";
            sql += "ORDER BY post_id DESC ";
            sql += "LIMIT 6;"


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
                // var file_temp = await client.query(sql, params); //multiple files per post
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
            // console.log(posts);
            client.release();
            var data;
            if (posts.length == 0) {
                data = {};
            } else {
                data = { posts, last_post_id: posts[posts.length - 1].post_id };
            }
            res.json(data);
        } else {
            client.release();
            res.render("error-page", {error: errors[0], title:"Error"});
        }
    } catch (err) {
        client.release();
        console.log("ERROR IS: ", err);
    }
});

router.get('/create', (req, res) => {
    // res.sendFile(process.cwd() + '/public/index.html');
    var errors = [];
    errors.push({ msg: 'You need to login to create a subforum.' })
    if (typeof req.user == 'undefined') {
        res.render('home', { user: req.user, errors, title:'Home' });
    }
    res.render('create-subforum', { user: req.user, title:"Create Subforum" });
})

router.post('/create', async(req, res) => {
    if (typeof req.user == 'undefined') {
        console.log('User not logged in');
        return;
    }
    console.log(req.body);
    try {
        var client = await pool.connect();
        console.log("connection successful!");
        console.log(req.user);
        //query 1
        var sql = "INSERT INTO subforum";
        sql += "(name,description,time_of_creation,creator_id)";
        sql += "VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING subforum_id; ";
        var params = [
            req.body.subforum_name,
            req.body.description,
            Number(req.user.user_id)
        ];
        var subforum = await client.query(sql, params);

        //query 2
        if (typeof req.body.categories != 'undefined') {
            let categoriesList = req.body.categories.split(',');
            for (var i = 0; i < categoriesList.length; i++) {
                sql = "INSERT INTO category";
                sql += "(category_name, subforum_id) ";
                sql += "VALUES($1, $2);"
                var params = [
                    categoriesList[i],
                    Number(subforum.rows[0].subforum_id)
                ];
                var category = await client.query(sql, params);
            }
        }
        client.release();
        // res.redirect("/view/" + res.body.name);
        res.redirect('/home');
    } catch (err) {
        client.release();
        console.log("ERROR IS : ", err);
    }
});


router.post("/follow", async(req, res) => {
    console.log('[POST] subforum/follow');

    try {
        if (req.user == 'undefined') {
            res.send('noone');
        } else {
            var client = await pool.connect();
            console.log("connection successful!");

            var sql = "SELECT subforum_id FROM subforum WHERE name=$1;";
            var params = [
                req.body.subforum_name
            ];
            var subforum_id = await client.query(sql, params);

            sql = "SELECT user_id FROM users WHERE username=$1;"
            params = [
                req.user.username
            ];
            var user_id = await client.query(sql, params);

            sql = "INSERT INTO user_subforum(user_id, subforum_id) ";
            sql += "VALUES($1, $2);";
            params = [
                Number(user_id.rows[0].user_id),
                Number(subforum_id.rows[0].subforum_id)
            ];
            var follow_subforum = await client.query(sql, params);
            client.release();
            res.send("accept");
        }
    } catch (err) {
        client.release();
        console.log("ERROR IS : ", err);
    }
});

router.post('/check', async(req, res) => {
    console.log('[POST] in subforum/check');
    // console.log(req.body);
    try {
        if (req.user == 'undefined') {
            res.send('yes');
        } else {
            console.log(req.user);
            var client = await pool.connect();
            console.log("connection successful!");

            var sql = "SELECT subforum_id, creator_id FROM subforum WHERE name = $1;";
            var params = [
                req.body.subforum_name
            ];

            var subforum_id = await client.query(sql, params);

            if (subforum_id.rowCount != 0) {

                if (subforum_id.rows[0].creator_id == req.user.user_id) {
                    res.send('yes');
                } else {
                    sql = "SELECT * FROM user_subforum WHERE subforum_id = $1 AND user_id=$2;";
                    params = [
                        Number(subforum_id.rows[0].subforum_id),
                        Number(req.user.user_id)
                    ];
                    var check = await client.query(sql, params);

                    if (check.rowCount == 0) {
                        res.send('no');
                    } //not part of subforum
                    else {
                        res.send('yes');
                    } // part of subforum
                }
            } else {
                res.send("yes");
            }
            client.release();
        }
    } catch (err) {
        client.release();
        console.log("ERROR IS: ", err);
    }
});



router.post("/delete/:subforum_name", async(req, res) => {

    console.log('[POST] subforum/delete/' + req.params.subforum_name);
    console.log(req.params.subforum_name);

    try {
        var client = await pool.connect();
        console.log("connection successful!");

        var params = [
            req.params.subforum_name
        ];

        var sql = "SELECT comment_id FROM comment ";
        sql += "WHERE post_id IN ";
        sql += "(SELECT post_id FROM post ";
        sql += "WHERE subforum_id IN ";
        sql += "(SELECT subforum_id FROM subforum ";
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
        sql1 += "WHERE subforum_id IN ";
        sql1 += "(SELECT subforum_id FROM subforum ";
        sql1 += "WHERE name = $1));";
        //query 2
        var sql2 = "DELETE FROM category ";
        sql2 += "WHERE post_id IN  ";
        sql2 += "(SELECT post_id FROM post ";
        sql2 += "WHERE subforum_id IN ";
        sql2 += "(SELECT subforum_id FROM subforum ";
        sql2 += "WHERE name = $1));";
        //query 3
        var sql3 = "DELETE FROM post_file ";
        sql3 += "WHERE post_id IN ";
        sql3 += "(SELECT post_id FROM post ";
        sql3 += "WHERE subforum_id IN ";
        sql3 += "(SELECT subforum_id FROM subforum ";
        sql3 += "WHERE name = $1));"
            //query 4
        var sql4 = "DELETE FROM post ";
        sql4 += "WHERE post_id IN ";
        sql4 += "(SELECT post_id FROM post ";
        sql4 += "WHERE subforum_id IN ";
        sql4 += "(SELECT subforum_id FROM subforum ";
        sql4 += "WHERE name = $1));"
            //query 5    
        var sql5 = "DELETE FROM user_subforum ";
        sql5 += "WHERE subforum_id IN ";
        sql5 += "(SELECT subforum_id FROM subforum ";
        sql5 += "WHERE name = $1);";
        //query 6
        var sql6 = "DELETE FROM category ";
        sql6 += "WHERE subforum_id IN  ";
        sql6 += "(SELECT subforum_id FROM subforum ";
        sql6 += "WHERE name = $1);";
        //query 7
        var sql7 = "DELETE FROM subforum ";
        sql7 += "WHERE name = $1;";


        var query1 = await client.query(sql1, params);
        var query2 = await client.query(sql2, params);
        var query3 = await client.query(sql3, params);
        var query4 = await client.query(sql4, params);
        var query5 = await client.query(sql5, params);
        var query6 = await client.query(sql6, params);
        var query7 = await client.query(sql7, params);
        client.release();
        res.redirect('/home');
    } catch (err) {
        client.release();
        console.log("ERROR IS : ", err);
    }
});


module.exports = router;