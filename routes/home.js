const express = require('express');
const {
    Client
} = require('pg');
const moment = require('moment');
const router = express.Router();

const {
    connectionString
} = require("../config/keys");

/*
    any new post will not be shown
    lazy loading will be used for any posts that arent new at that time
    post_id is used to keep track of last post displayed in the page
    that post_id(of the last post on the page) will be passed as query string post_id=x
    x will then be used to get next post
    this will happen for user not logged in as it has no interest functionality
 
*/


router.get('/', async(req, res) => {
    // res.send('hello');
    console.log('/home');
    res.render('home', {
        user: req.user
    });
    // console.log(req.query);

});

// query string should have post_id of last (oldest, the one with the smallest post id) post displayed
// query string -- post_id
router.get('/get-posts', async(req, res) => {
    console.log('[GET]: /home/get-posts');
    const client = new Client({
        connectionString: connectionString
    });
    try {
        await client.connect();
        console.log("connection successful!");

        if (typeof req.user == 'undefined') {
            // for not logged in user
            if (typeof req.query.post_id != 'undefined') {
                console.log("query.post_id:" + req.query.post_id);
                var params = [Number(req.query.post_id)];
            } else {
                var params = [Number.MAX_SAFE_INTEGER];
            }
            var sql = "SELECT * FROM post ";
            sql += "WHERE community_id IS NULL AND post_id < $1 ";
            sql += "ORDER BY post_id DESC ";
            sql += "LIMIT 6;";

            var postsResult = await client.query(sql, params);

            var posts = []
            console.log(postsResult.rows.length);
            for (let i = 0; i < postsResult.rows.length; i++) {
                let postResult = postsResult.rows[i];
                sql = "SELECT username FROM users ";
                sql += "WHERE user_id = $1 ";
                var params = [Number(postResult.author_id)];

                var authorResult = await client.query(sql, params);

                sql = "SELECT name FROM subforum ";
                sql += "WHERE subforum_id = $1 ";
                var params = [Number(postResult.subforum_id)];

                var subforumResult = await client.query(sql, params);


                sql = "SELECT category_name FROM category ";
                sql += "WHERE post_id = $1;";
                params3 = [Number(postResult.post_id)];

                var categoryResults = await client.query(sql, params); //multiple categories
                var categoriesList = ''
                categoryResults.rows.forEach(categoryResult => {
                    categoriesList += categoryResult.category_name + ',';
                });

                // TODO: Retrieve files associated with the post, although that shouldn't be required for home page
                /*
                var sql = "SELECT file_name FROM post_file ";
                sql += "WHERE post_id = $1;";
                var params = [Number(post.rows[i].post_id)];

                var file_temp = await client.query(sql, params);
                for (let i = 0; i < file_temp.rows.length; i++) {
                    file_temp.rows[i].file_name = process.cwd() + "/public/uploads/postFiles/" + file_temp.rows[i].file_name;
                }
                file.push(file_temp.rows);
                */


                let post = {
                    post_id: postResult.post_id,
                    title: postResult.title,
                    content: postResult.content.substring(0, 100) + "...",
                    time: moment(postResult.time_of_creation).format('h:mm a'),
                    date: moment(postResult.time_of_creation).format('MMM D, YYYY'),
                    upvotes: postResult.upvotes,
                    downvotes: postResult.downvotes,
                    author_username: authorResult.rows[0].username,
                    subforum: subforumResult.name,
                    categoriesList
                };

                posts.push(post);
            }
        } else { //logged in user
            sql = "SELECT interest FROM user_interest ";
            sql += "WHERE user_id = $1;";
            params = [
                req.user.user_id
            ];
            var interests = await client.query(sql, params); //list of interests
            // console.log(interests.rows);

            sql = "SELECT qualification FROM user_qualification ";
            sql += "WHERE user_id = $1;";
            var qualifications = await client.query(sql, params); //list of qualifications
            // console.log(qualifications.rows);

            sql = "SELECT about FROM user_about ";
            sql += "WHERE user_id = $1;";
            var about = await client.query(sql, params);
            // console.log(about.rows);

            var post_ids = [];

            // According to user's interests
            for (var i = 0; i < interests.rows.length; i++) {
                params = [interests.rows[i].interests.replace(/ /g, " | ")];

                sql = "SELECT post_id FROM category ";
                sql += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
                sql += "AND post_id IS NOT NULL;";
                var byCategory = await client.query(sql, params);

                byCategory.rows.forEach(row => post_ids.push(row.post_id));


                sql = "SELECT post_id FROM post ";
                sql += "WHERE to_tsvector(title) @@ to_tsquery($1) OR ";
                sql += "to_tsvector(content) @@ to_tsquery($1);";
                var byTitle = await client.query(sql, params);

                byTitle.rows.forEach(row => post_ids.push(row.post_id));
            }
            // According to user's qualifications
            for (var i = 0; i < qualifications.rows.length; i++) {
                params = [qualifications.rows[i].qualifications.replace(/ /g, " | ")];

                sql = "SELECT post_id FROM category ";
                sql += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
                sql += "AND post_id IS NOT NULL;";
                var byCategory = await client.query(sql, params);

                byCategory.rows.forEach(row => post_ids.push(row.post_id));

                sql = "SELECT post_id FROM post ";
                sql += "WHERE to_tsvector(title) @@ to_tsquery($1) OR ";
                sql += "to_tsvector(content) @@ to_tsquery($1);";
                var byTitle = await client.query(sql, params);

                byTitle.rows.forEach(row => post_ids.push(row.post_id));
            }

            // According to user's about text
            params = [about.rows[0].about.replace(/ /g, " | ")];

            sql = "SELECT post_id FROM category ";
            sql += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
            sql += "AND post_id IS NOT NULL;";
            var byCategory = await client.query(sql, params);

            byCategory.rows.forEach(row => post_ids.push(row.post_id));

            sql = "SELECT post_id FROM post ";
            sql += "WHERE to_tsvector(title) @@ to_tsquery($1) OR ";
            sql += "to_tsvector(content) @@ to_tsquery($1);";
            var byTitle = await client.query(sql, params);

            byTitle.rows.forEach(row => post_ids.push(row.post_id));


            post_ids = Array.from(new Set(post_ids));

            //sort on the basis of post_id in desc order(to get latest content on top)
            post_ids.sort((a, b) => Number(b) - Number(a));
            var post_ids_temp = post_ids;

            var last_post;
            if (typeof req.query.post_id != 'undefined') {
                last_post = post_ids.findIndex((item) => { //returns index of last post, not post_id
                    return item == req.query.post_id; //returns -1 if not found
                });
            } else { last_post = -1; }
            console.log(`last_post: ${last_post}`);

            /* 
            go in only if there is a query.post_id as last_post is -1 at the first get request without query.post_id
            first condition is if no posts match interests, qualifications and about
            second condition is if the last post is reached for interests, qualifications and about
            third condition is if we have already entered this 'if block' once, its last post_id wont be found in interests, qualifications and about's post_ids[]
            */
            if (typeof req.query.post_id != 'undefined') {
                if (post_ids.length == 0 || post_ids.length - 1 == last_post || last_post == -1) {

                    post_ids = [];

                    // According to user's interests
                    for (var i = 0; i < interests.rows.length; i++) {
                        params = [interests.rows[i].interests.replace(/ /g, " | ")];

                        sql = "SELECT post_id FROM category ";
                        sql += "WHERE post_id IS NOT NULL AND NOT to_tsvector(category_name) @@ to_tsquery($1);";
                        var byCategory = await client.query(sql, params);

                        byCategory.rows.forEach(row => {
                            if (!post_ids_temp.includes(row.post_id)) {
                                post_ids.push(row.post_id);
                            }
                        });

                        sql = "SELECT post_id FROM post ";
                        sql += "WHERE NOT to_tsvector(title) @@ to_tsquery($1) AND ";
                        sql += "NOT to_tsvector(content) @@ to_tsquery($1);";
                        var byTitle = await client.query(sql, params);

                        byTitle.rows.forEach(row => {
                            if (!post_ids_temp.includes(row.post_id)) {
                                post_ids.push(row.post_id);
                            }
                        });
                    }

                    // According to user's qualifications
                    for (var i = 0; i < qualifications.rows.length; i++) {

                        params = [qualifications.rows[i].qualifications.replace(/ /g, " | ")];

                        sql = "SELECT post_id FROM category ";
                        sql += "WHERE post_id IS NOT NULL AND NOT to_tsvector(category_name) @@ to_tsquery($1);";
                        var byCategory = await client.query(sql, params);

                        byCategory.rows.forEach(row => {
                            if (!post_ids_temp.includes(row.post_id)) {
                                post_ids.push(row.post_id);
                            }
                        });

                        sql = "SELECT post_id FROM post ";
                        sql += "WHERE NOT to_tsvector(title) @@ to_tsquery($1) AND ";
                        sql += "NOT to_tsvector(content) @@ to_tsquery($1);";
                        var byTitle = await client.query(sql, params);

                        byTitle.rows.forEach(row => {
                            if (!post_ids_temp.includes(row.post_id)) {
                                post_ids.push(row.post_id);
                            }
                        });
                    }

                    // According to user's about text
                    params = [about.rows[0].about.replace(/ /g, " | ")];

                    sql = "SELECT post_id FROM category ";
                    sql += "WHERE post_id IS NOT NULL AND NOT to_tsvector(category_name) @@ to_tsquery($1);";
                    var byCategory = await client.query(sql, params);

                    byCategory.rows.forEach(row => {
                        if (!post_ids_temp.includes(row.post_id)) {
                            post_ids.push(row.post_id);
                        }
                    });

                    sql = "SELECT post_id FROM post ";
                    sql += "WHERE NOT to_tsvector(title) @@ to_tsquery($1) AND ";
                    sql += "NOT to_tsvector(content) @@ to_tsquery($1);";
                    var byTitle = await client.query(sql, params);

                    byTitle.rows.forEach(row => {
                        if (!post_ids_temp.includes(row.post_id)) {
                            post_ids.push(row.post_id);
                        }
                    });


                    post_ids = Array.from(new Set(post_ids));

                    post_ids.sort((a, b) => Number(b) - Number(a));

                    var last_post;
                    if (typeof req.query.post_id != 'undefined') {
                        last_post = post_ids.findIndex((item) => {
                            return item == req.query.post_id;
                        });
                    } else { last_post = -1; }
                    console.log(`last_post: ${last_post}`);
                }
            }

            var posts = []; // array of posts

            for (var i = last_post + 1; i < post_ids.length && i - last_post + 1 < 6; i++) { //6 -- no. posts on one lazy load
                sql = "SELECT * FROM post ";
                sql += "WHERE post_id = $1 AND community_id IS NULL;";
                params = [post_ids[i]];
                var postResult = await client.query(sql, params);
                postResult = postResult.rows[0];

                sql = "SELECT username FROM users ";
                sql += "WHERE user_id = $1 ";
                params = [Number(postResult.author_id)];
                var authorResult = await client.query(sql, params);
                authorResult = authorResult.rows[0];

                sql = "SELECT name FROM subforum ";
                sql += "WHERE subforum_id = $1 ";
                params2 = [Number(postResult.subforum_id)];
                var subforumResult = await client.query(sql, params);
                subforumResult = subforumResult.rows[0];
                if (typeof subforumResult == 'undefined')
                    subforumResult = { name: "" };

                sql = "SELECT category_name FROM category ";
                sql += "WHERE post_id = $1;";
                params = [Number(postResult.post_id)];
                var categoryResults = await client.query(sql, params); //multiple categories

                var categoriesList = ''
                categoryResults.rows.forEach(categoryResult => {
                    categoriesList += categoryResult.category_name + ',';
                });


                /*
                var sql = "SELECT file_name FROM post_file ";
                sql += "WHERE post_id = $1;";
                params = [Number(post_temp.rows[0].post_id)];
                    var file_temp = await client.query(sql, params);
                for (var i = 0; i < file_temp.rows.length; i++) {
                    file_temp.rows[i].file_name = process.cwd() + "/public/uploads/postFiles/" + file_temp.rows[i].file_name;
                }
                file.push(file_temp.rows); */


                let post = {
                    post_id: postResult.post_id,
                    title: postResult.title,
                    content: postResult.content.substring(0, 40) + "...",
                    time: moment(postResult.time_of_creation).format('h:mm a'),
                    date: moment(postResult.time_of_creation).format('MMM D, YYYY'),
                    upvotes: postResult.upvotes,
                    downvotes: postResult.downvotes,
                    author_username: authorResult.username,
                    subforum: subforumResult.name,
                    categoriesList
                };
                posts.push(post);
            }
        }
        var data;
        if (posts.length == 0)
            data = {}
        else
            data = { posts, last_post_id: posts[posts.length - 1].post_id };
        res.json(data);
    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});


router.get('/get-subforums', async(req, res) => {
    console.log('[GET]: /home/get-subforums');
    const client = new Client({
        connectionString: connectionString
    });
    try {
        await client.connect();
        if (typeof req.user == 'undefined') { // user not logged in
            console.log('User not logged in');

            if (typeof req.query.subforum_id != 'undefined') {
                console.log("query.subforum_id:" + req.query.subforum_id);
                var params = [Number(req.query.subforum_id)];
            } else
                var params = [Number.MAX_SAFE_INTEGER];

            var sql = "SELECT * FROM subforum ";
            sql += "ORDER BY subforum_id DESC AND subforum_id < $1 ";
            sql += "LIMIT 6;";
            var subforumResults = await client.query(sql, params);
            var subforums = []
            for (let i = 0; i < subforumResults.rows.length; i++) {

                let subforumResult = subforumResults.rows[i];

                sql = "SELECT username FROM users ";
                sql += "WHERE user_id = $1 ";
                params = [Number(subforumResult.creator_id)];

                var creatorResult = await client.query(sql, params);
                creatorResult = creatorResult.rows[0];

                sql = "SELECT category_name FROM category ";
                sql += "WHERE subforum_id = $1;";
                params = [Number(subforumResult.subforum_id)];

                var categoryResults = await client.query(sql, params); //multiple categories
                var categoriesList = ''
                categoryResults.rows.forEach(categoryResult => {
                    categoriesList += categoryResult.category_name + ',';
                });


                let subforum = {
                    subforum_id: subforumResult.subforum_id,
                    name: subforumResult.name,
                    description: subforumResult.description,
                    date: moment(subforumResult.time_of_creation).format('MMM D, YYYY'),
                    creator_username: creatorResult.username,
                    categoriesList
                }
                subforums.push(subforum);
            }

        } else {
            console.log('User is logged in!');

            sql = "SELECT interest FROM user_interest ";
            sql1 += "WHERE user_id = $1;";
            params = [
                req.user.user_id
            ];
            var interests = await client.query(sql, params);
            // console.log(interests.rows);

            sql = "SELECT qualification FROM user_qualification ";
            sql += "WHERE user_id = $1;";
            var qualifications = await client.query(sql, params);
            // console.log(qualifications.rows);

            sql = "SELECT about FROM user_about ";
            sql += "WHERE user_id = $1;";
            var about = await client.query(sql, params);
            // console.log(about.rows);

            var subforum_ids = [];

            // According to user's interests
            for (var i = 0; i < interests.rows.length; i++) {
                params = [interests.rows[i].interests.replace(/ /g, " | ")];

                sql = "SELECT subforum_id FROM category ";
                sql += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
                sql += "AND subforum_id IS NOT NULL;";

                var byCategory = await client.query(sql, params);
                byCategory.rows.forEach(row => subforum_ids.push(row.subforum_id));

                sql = "SELECT subforum_id FROM subforum ";
                sql += "WHERE to_tsvector(name) @@ to_tsquery($1) OR ";
                sql += "to_tsvector(description) @@ to_tsquery($1)";

                var byTitle = await client.query(sql, params);
                byTitle.rows.forEach(row => subforum_ids.push(row.subforum_id));

            }

            // According to user's qualifications
            for (var i = 0; i < qualifications.rows.length; i++) {
                params = [
                    qualifications.rows[i].qualifications.replace(/ /g, " | "),
                ];

                sql = "SELECT subforum_id FROM category ";
                sql += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
                sql += "AND subforum_id IS NOT NULL;";

                var byCategory = await client.query(sql, params);
                byCategory.rows.forEach(row => subforum_ids.push(row.subforum_id));


                sql = "SELECT subforum_id FROM subforum ";
                sql += "WHERE to_tsvector(name) @@ to_tsquery($1) OR ";
                sql += "to_tsvector(description) @@ to_tsquery($1)";

                var byTitle = await client.query(sql, params);
                byTitle.rows.forEach(row => subforum_ids.push(row.subforum_id));

            }
            //about
            params = [about.rows[0].about.replace(/ /g, " | ")];

            sql = "SELECT subforum_id FROM category ";
            sql += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
            sql += "AND subforum_id IS NOT NULL;";

            var byCategory = await client.query(sql, params);
            byCategory.rows.forEach(row => subforum_ids.push(row.subforum_id));

            sql = "SELECT subforum_id FROM subforum ";
            sql += "WHERE to_tsvector(name) @@ to_tsquery($1) OR ";
            sql += "to_tsvector(description) @@ to_tsquery($1)";

            var byTitle = await client.query(sql, params);
            byTitle.rows.forEach(row => subforum_ids.push(row.subforum_id));

            //removing duplicates
            subforum_ids = Array.from(new Set(subforum_ids));

            //sort on the basis of subforum_id in desc order(to get latest content on top)
            subforum_ids.sort((a, b) => Number(b) - Number(a));
            var subforum_ids_temp = subforum_ids;

            var last_subforum;
            if (typeof req.query.subforum_id != 'undefined') {
                last_subforum = subforum_ids.findIndex((item) => {
                    return item == req.query.subforum_id;
                });
            } else { last_subforum = -1; }
            console.log(`last_subforum: ${last_subforum}`);


            if (typeof req.query.subforum_id != 'undefined') {
                if (subforum_ids.length == 0 || subforum_ids.length - 1 == last_subforum || last_subforum == -1) {
                    subforum_ids = [];

                    for (var i = 0; i < interests.rows.length; i++) {
                        params = [interests.rows[i].interests.replace(/ /g, " | ")];

                        sql = "SELECT subforum_id FROM category ";
                        sql += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
                        sql += "AND subforum_id IS NOT NULL;";

                        var byCategory = await client.query(sql, params);
                        byCategory.rows.forEach(row => {
                            if (!subforum_ids_temp.includes(row.subforum_id)) {
                                subforum_ids.push(row.subforum_id);
                            }
                        });
                        sql = "SELECT subforum_id FROM subforum ";
                        sql += "WHERE to_tsvector(name) @@ to_tsquery($1) OR ";
                        sql += "to_tsvector(description) @@ to_tsquery($1)";

                        var byTitle = await client.query(sql, params);
                        byTitle.rows.forEach(row => {
                            if (!subforum_ids_temp.includes(row.subforum_id)) {
                                subforum_ids.push(row.subforum_id);
                            }
                        });
                    }

                    // According to user's qualifications
                    for (var i = 0; i < qualifications.rows.length; i++) {
                        params = [
                            qualifications.rows[i].qualifications.replace(/ /g, " | "),
                        ];

                        sql = "SELECT subforum_id FROM category ";
                        sql += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
                        sql += "AND subforum_id IS NOT NULL;";

                        var byCategory = await client.query(sql, params);
                        byCategory.rows.forEach(row => {
                            if (!subforum_ids_temp.includes(row.subforum_id)) {
                                subforum_ids.push(row.subforum_id);
                            }
                        });

                        sql = "SELECT subforum_id FROM subforum ";
                        sql += "WHERE to_tsvector(name) @@ to_tsquery($1) OR ";
                        sql += "to_tsvector(description) @@ to_tsquery($1)";

                        var byTitle = await client.query(sql, params);
                        byTitle.rows.forEach(row => {
                            if (!subforum_ids_temp.includes(row.subforum_id)) {
                                subforum_ids.push(row.subforum_id);
                            }
                        });
                    }
                    //about
                    params = [about.rows[0].about.replace(/ /g, " | ")];

                    sql = "SELECT subforum_id FROM category ";
                    sql += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
                    sql += "AND subforum_id IS NOT NULL;";

                    var byCategory = await client.query(sql, params);
                    byCategory.rows.forEach(row => {
                        if (!subforum_ids_temp.includes(row.subforum_id)) {
                            subforum_ids.push(row.subforum_id);
                        }
                    });

                    sql = "SELECT subforum_id FROM subforum ";
                    sql += "WHERE to_tsvector(name) @@ to_tsquery($1) OR ";
                    sql += "to_tsvector(description) @@ to_tsquery($1)";

                    var byTitle = await client.query(sql, params);
                    byTitle.rows.forEach(row => {
                        if (!subforum_ids_temp.includes(row.subforum_id)) {
                            subforum_ids.push(row.subforum_id);
                        }
                    });

                    //removing duplicates
                    subforum_ids = Array.from(new Set(subforum_ids));
                    console.log(subforum_ids);

                    //sort on the basis of subforum_id in desc order(to get latest content on top)
                    subforum_ids.sort((a, b) => Number(b) - Number(a));
                }
            }

            for (var i = last_subforum + 1; i < subforum_ids.length && i - last_subforum + 1 < 6; i++) {
                var sql = "SELECT * FROM subforum ";
                sql += "WHERE subforum_id = $1;";
                params = [Number(subforum_ids[i])];
                var subforumResult = await client.query(sql, params);
                subforumResult = subforumResult.rows[0];

                var sql1 = "SELECT username FROM users ";
                sql1 += "WHERE user_id = $1 ";
                var params1 = [Number(subforumResult.creator_id)];
                var creatorResult = await client.query(sql1, params1);
                creatorResult = creatorResult.rows[0];

                var sql2 = "SELECT category_name FROM category ";
                sql2 += "WHERE subforum_id = $1;";
                params2 = [Number(subforum_temp.rows[0].subforum_id)];
                var categoryResults = await client.query(sql2, params2); //multiple categories
                var categoriesList = ''
                categoryResults.rows.forEach(categoryResult => {
                    categoriesList += categoryResult.category_name + ',';
                });

                let subforum = {
                    subforum_id: subforumResult.subforum_id,
                    name: subforumResult.name,
                    description: subforumResult.description,
                    date: moment(subforumResult.time_of_creation).format('MMM D, YYYY'),
                    creator_username: creatorResult.username,
                    categoriesList
                }

                subforums.push(subforum);
            }
        }
        var data = {
            subforums,
            last_subforum_id: subforums[subforums.length - 1].subforum_id
        };
        res.json(data);
    } catch (err) {
        console.log('[ERROR]: In /home/get-subforums');
        console.error(err);
    }
});


module.exports = router;