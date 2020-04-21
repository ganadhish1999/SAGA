/*
    search?...
*/


const express = require("express");
const { Pool } = require("pg");
const lodash = require("lodash");
const router = express.Router();
const moment = require('moment');

const { connectionString } = require("../config/keys");

router.get("/", async(req, res) => { //full post not to be displayed in search
    res.send("hello");
    console.log(req.query);
    //query will be encoded as it is a query String -- so here, we do
    //decodeURI(req.query.search);

    var search = decodeURI(req.query.search);

    const pool = new Pool({ connectionString: connectionString });
    try {
        await pool.connect();
        console.log("connection successful!");

        var params = [
            search.replace(/ /g, " | "), //takes each word of the query
        ];
        //post serach
        var posts = [];

        var sql = "SELECT * FROM post ";
        sql += "WHERE (to_tsvector(title) @@ to_tsquery($1) ";
        sql += "OR to_tsvector(content) @@ to_tsquery($1)) ";
        sql += "OR post_id IN ";
        sql += "(SELECT post_id FROM category ";
        sql += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
        sql += "AND post_id IS NOT NULL) ";
        sql += "AND community_id IS NULL ";
        sql += "ORDER BY upvotes DESC;"; //sorted by upvotes in descendng order

        var postsResult = await pool.query(sql, params);

        for (var i = 0; i < postsResult.rows.length; i++) {
            let postResult = postsResult.rows[i];
            sql = "SELECT username FROM users ";
            sql += "WHERE user_id = $1 ";
            var params1 = [Number(postResult.author_id)];
            var author = await pool.query(sql, params1);

            sql = "SELECT category_name FROM category ";
            sql += "WHERE post_id = $1;";
            params1 = [Number(postResult.post_id)];
            var categoryResults = await pool.query(sql, params1);
            let categoriesList = [];
            categoryResults.rows.forEach((categoryResult) => {
                categoriesList.push(categoryResult.category_name);
            });

            // sql = "SELECT file_name FROM post_file ";
            // sql += "WHERE post_id = $1;";
            // params1 = [
            //     Number(postResult.post_id)
            // ];
            // var file_temp = await pool.query(sql, params1); //multiple files per post
            // for (var i = 0; i < file_temp.rows.length; i++) {
            //     file_temp.rows[i].file_name = process.cwd() + "/public/uploads/postFiles/" + file_temp.rows[i].file_name;
            // }
            // file.push(file_temp.rows);


            if (postResult.subforum_id) {
                sql = "SELECT name FROM subforum ";
                sql += "WHERE subforum_id = $1 ";
                var params = [Number(postResult.subforum_id)];

                var subforumResult = await pool.query(sql, params);

                let post = {
                    post_id: postResult.post_id,
                    title: postResult.title,
                    content: postResult.content,
                    time: moment(postResult.time_of_creation).format("h:mm a"),
                    date: moment(postResult.time_of_creation).format("MMM D, YYYY"),
                    upvotes: postResult.upvotes,
                    downvotes: postResult.downvotes,
                    author: author.rows[0].username,
                    subforum: subforumResult.rows[0].name,
                    category: categoriesList,
                };
                posts.push(post);
            } else {
                let post = {
                    post_id: postResult.post_id,
                    title: postResult.title,
                    content: postResult.content,
                    time: moment(postResult.time_of_creation).format("h:mm a"),
                    date: moment(postResult.time_of_creation).format("MMM D, YYYY"),
                    upvotes: postResult.upvotes,
                    downvotes: postResult.downvotes,
                    author: author.rows[0].username,
                    category: categoriesList,
                };
                posts.push(post);
            }

        } //post search end

        //subforum search
        var subforums = [];

        sql = "SELECT * FROM subforum ";
        sql += "WHERE to_tsvector(name) @@ to_tsquery($1) ";
        sql += "OR to_tsvector(description) @@ to_tsquery($1) ";
        sql += "OR subforum_id IN ";
        sql += "(SELECT subforum_id FROM category ";
        sql += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
        sql += "AND subforum_id IS NOT NULL) ";
        sql += "ORDER BY time_of_creation DESC;";
        var subforumsResult = await pool.query(sql, params);

        for (var i = 0; i < subforumsResult.rows.length; i++) {

            var subforumResult = subforumsResult.rows[i];

            sql = "SELECT username FROM users ";
            sql += "WHERE user_id = $1 ";
            params1 = [Number(subforumResult.creator_id)];
            var creator = await pool.query(sql, params1);

            sql = "SELECT category_name FROM category ";
            sql += "WHERE subforum_id = $1;";
            params1 = [Number(subforumResult.subforum_id)];
            var categoryResults = await pool.query(sql, params1);
            let categoriesList = [];
            categoryResults.rows.forEach((categoryResult) => {
                categoriesList.push(categoryResult.category_name);
            });

            let subforum = {
                name: subforumResult.name,
                description: subforumResult.description,
                time: moment(subforumResult.time_of_creation).format("h:mm a"),
                date: moment(subforumResult.time_of_creation).format("MMM D, YYYY"),
                creator: creator.rows[0].username,
                category: categoriesList,
            };
            subforums.push(subforum);

        } //subforum search end

        //community search

        var communities = [];

        sql = "SELECT * FROM community ";
        sql += "WHERE to_tsvector(name) @@ to_tsquery($1) ";
        sql += "OR to_tsvector(description) @@ to_tsquery($1) ";
        sql += "ORDER BY time_of_creation DESC;";
        var communitiesResult = await pool.query(sql, params);

        for (var i = 0; i < communitiesResult.rows.length; i++) {
            let communityResult = communitiesResult.rows[i];
            sql = "SELECT username FROM users ";
            sql += "WHERE user_id = $1 ";
            params1 = [Number(communityResult.creator_id)];
            var creator = await pool.query(sql, params1);

            let community = {
                name: communityResult.name,
                description: communityResult.description,
                time: moment(communityResult.time_of_creation).format("h:mm a"),
                date: moment(communityResult.time_of_creation).format("MMM D, YYYY"),
                creator: creator.rows[0].username
            };
            communities.push(community);
        } //community search end

        //user search
        sql = "SELECT username, first_name, last_name, email, dob, profile_image_name FROM users ";
        sql += "WHERE to_tsvector(username) @@ to_tsquery($1) ";
        sql += "OR to_tsvector(first_name) @@ to_tsquery($1) ";
        sql += "OR to_tsvector(last_name) @@ to_tsquery($1) ";
        sql += "OR to_tsvector(email) @@ to_tsquery($1);";
        var users = await pool.query(sql, params);
        //user search end

        var data = {
            post: posts,
            subforum: subforums,
            community: communities,
            user: users.rows
        };

    } catch (err) {
        console.log("ERROR IS: ", err);
    }
});

module.exports = router;

//https://www.compose.com/articles/mastering-postgresql-tools-full-text-search-and-phrase-search/
/*
    search posts(not community), subforums, communities, users

    search basis -- 

    posts - title, content, category->post

    subforum - name, description, category->subforum

    community - name, description

    user - username, firstname, lastname, email
*/