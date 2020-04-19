/*
    community/
             /create
             /follow
             /delete
*/


const express = require('express');
const { Client } = require('pg');
const router = express.Router();
const moment = require('moment');

const { connectionString } = require("../config/keys");

router.get('/view/:community_name', async(req, res) => {
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        await client.connect();
        console.log("connection successful!");

        var sql = "SELECT community_id FROM community WHERE name = $1;";
        var params = [
            req.params.community_name
        ];
        var community_id = await client.query(sql, params);

        if (community_id.rowCount != 0) { //else rediect somewhere

            sql = "SELECT * FROM community ";
            sql += "WHERE community_id = $1;";
            params = [
                Number(community_id.rows[0].community_id)
            ];
            var communityResult = await client.query(sql, params);
            sql = "SELECT username FROM users ";
            sql += "WHERE user_id = $1;";
            params = [
                Number(communityResult.rows[0].creator_id)
            ];
            var creator = await client.query(sql, params);

            let community = {
                name: communityResult.rows[0].name,
                description: communityResult.rows[0].description,
                time: moment(communityResult.rows[0].time_of_creation).format("h:mm a"),
                date: moment(communityResult.rows[0].time_of_creation).format("MMM D, YYYY"),
                creator_username: creator.rows[0].username
            }

            //all posts of the community
            if (typeof req.query.post_id != 'undefined') {
                console.log("query.post_id:" + req.query.post_id);
                var params = [Number(req.query.post_id)];
            } else {
                var params = [Number.MAX_SAFE_INTEGER];
            }

            sql = "SELECT * FROM post ";
            sql += "WHERE community_id = $1 AND post_id < $2 ";
            sql += "ORDER BY community_id DESC ";
            sql += "LIMIT 6;";
            params = [
                community_id.rows[0].community_id,
                req.query.post_id
            ];
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

            var data = {
                post: posts, //array of posts --all column names
                // file: file, //2D array of files(MULTIPLE files per post(absolute file path)) --file_name
                community: community
            };
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

        var sql = "INSERT INTO community";
        sql += "(name,description,timestamp,creator_id)";
        sql += "VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING *";
        var params = [
            req.body.name,
            req.body.description,
            Number(req.body.creator_id)
        ];
        var community = await client.query(sql, params);
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

        var sql = "INSERT INTO user_community ";
        sql += "(SELECT $2, community_id FROM community ";
        sql += "WHERE name=$1);";
        var params = [
            req.body.name,
            Number(req.body.user_id)
        ];
        var follow_community = await client.query(sql, params);
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
        var query1 = await client.query(sql1, params);
        var query2 = await client.query(sql2, params);
        var query3 = await client.query(sql3, params);
        var query4 = await client.query(sql4, params);
        var query5 = await client.query(sql5, params);
        var query6 = await client.query(sql6, params);
    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});


module.exports = router;