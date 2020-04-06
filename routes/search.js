/*
    search?...
*/

const express = require("express");
const { Client } = require("pg");
const lodash = require("lodash");
const router = express.Router();

const { connectionString } = require("../config/keys");

/*
    any new post will not be shown
    lazy loading will be used for any posts that arent new at that time
    post_id is used to keep track of last post displayed in the page
    that post_id(of the last post on the page) will be passed as query string post_id=x
    x will then be used to get next post
    this will happen for user not logged in as it has no interest functionality
*/

router.get("/", async(req, res) => { //full post not to be displayed in search
    res.send("hello");
    console.log(req.query);
    //query will be encoded as it is a query String -- so here, we do
    //decodeURI(req.query.search);

    var search = decodeURI(req.query.search);

    const client = new Client({ connectionString: connectionString });
    try {
        await client.connect();
        console.log("connection successful!");

        var params = [
            search.replace(/ /g, " | "), //takes eaach word of the query
        ];

        //post serach
        var sql = "SELECT * FROM post ";
        sql += "WHERE (to_tsvector(title) @@ to_tsquery($1) ";
        sql += "OR to_tsvector(content) @@ to_tsquery($1)) ";
        sql += "OR post_id IN ";
        sql += "(SELECT post_id FROM category ";
        sql += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
        sql += "AND post_id IS NOT NULL) ";
        sql += "AND community_id IS NULL ";
        sql += "ORDER BY upvotes DESC;"; //sorted by upvotes in descendng order

        var post = await client.query(sql, params);

        var author_post = [];
        var subforum_name_post = [];
        var category_post = [];

        for (var i = 0; i < post.rows.length; i++) {
            var sql1 = "SELECT username FROM users ";
            sql1 += "WHERE user_id = $1 ";
            var params1 = [Number(post.rows[i].author_id)];

            var sql2 = "SELECT name FROM subforum ";
            sql2 += "WHERE subforum_id = $1 ";
            var params2 = [Number(post.rows[i].subforum_id)];

            var sql3 = "SELECT category_name FROM category ";
            sql3 += "WHERE post_id = $1;";
            params3 = [Number(post.rows[i].post_id)];

            var author_post_temp = await client.query(sql1, params1);
            author_post.push(author_post_temp.rows[0]);

            var subforum_name_post_temp = await client.query(sql2, params2);
            subforum_name_post.push(subforum_name_post_temp.rows[0]);

            var category_post_temp = await client.query(sql3, params3); //multiple categories
            category_post.push(category_post_temp.rows);
        } //post search end

        //subforum search
        sql = "SELECT * FROM subforum ";
        sql += "WHERE to_tsvector(name) @@ to_tsquery($1) ";
        sql += "OR to_tsvector(description) @@ to_tsquery($1) ";
        sql += "OR subforum_id IN ";
        sql += "(SELECT subforum_id FROM category ";
        sql += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
        sql += "AND subforum_id IS NOT NULL) ";
        sql += "ORDER BY timestamp DESC;";

        var subforum = await client.query(sql, params);

        for (var i = 0; i < subforum.rows.length; i++) {
            var sql1 = "SELECT username FROM users ";
            sql1 += "WHERE user_id = $1 ";
            var params1 = [Number(subforum.rows[i].creator_id)];

            var sql2 = "SELECT category_name FROM category ";
            sql2 += "WHERE subforum_id = $1;";
            params2 = [Number(subforum.rows[i].subforum_id)];

            var creator_subforum_temp = await client.query(sql1, params1);
            creator_subforum.push(creator_subforum_temp.rows[0]);

            var category_subforum_temp = await client.query(sql2, params2); //multiple categories
            category_subforum.push(category_subforum_temp.rows);
        } //subforum search end

        //community search
        sql = "SELECT * FROM community ";
        sql += "WHERE to_tsvector(name) @@ to_tsquery($1) ";
        sql += "OR to_tsvector(description) @@ to_tsquery($1) ";
        sql += "ORDER BY timestamp DESC;";

        var community = await client.query(sql, params);

        for (var i = 0; i < community.rows.length; i++) {
            var sql1 = "SELECT username FROM users ";
            sql1 += "WHERE creator_id = $1 ";
            var params1 = [Number(community.rows[i].creator_id)];

            var creator_community_temp = await client.query(sql1, params1);
            creator_community.push(creator_community_temp.rows[0]);
        } //community search end

        //user search
        sql = "SELECT * FROM users ";
        sql += "WHERE to_tsvector(username) @@ to_tsquery($1) ";
        sql += "OR to_tsvector(first_name) @@ to_tsquery($1) ";
        sql += "OR to_tsvector(last_name) @@ to_tsquery($1);";

        var user = await client.query(sql, params);
        //user search end

        var data = {
            post: post.rows, //array of posts --all column names
            author: author_post, //array of authors --username
            subforum_post: subforum_name_post, //array of subforum names for each post -- name
            category_post: category_post, //2D array of categories(MULTIPLE categories per post) --category_name
            subforum: subforum.rows, //array of subforum --all column names
            creator_subforum: creator_subforum, //array of creators of subforums --username
            category_subforum: category_subforum, //2D array of categories(MULTIPLE categories per subforum) --category_name
            community: community.rows, //array of communities --all column names
            creator_community: creator_community, //array of creators of communities --username
            user: user.rows //array of users --all column names
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

    user - username, firstname, lastname
*/