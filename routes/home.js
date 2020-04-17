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


router.get('/', async (req, res) => {
    // res.send('hello');
    console.log('/home');
    res.render('home', {
        user: req.user
    });
    // console.log(req.query);

});

// query string should have post_id of last (oldest, the one with the smallest post id) post displayed
// query string -- post_id
router.get('/get-posts', async (req, res) => {
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
                var params = [
                    Number(req.query.post_id)
                ];
                var sql = "SELECT COUNT(*) FROM post ";
                sql += "WHERE post_id >= $1;";

                var count_post = await client.query(sql, params);
                params = [
                    Number(count_post.rows[0].count)
                ];
            }
            else {
                var params = [0];
            }
            sql = "SELECT * FROM post ";
            sql += "WHERE community_id IS NULL ";
            sql += "ORDER BY post_id DESC ";
            sql += "LIMIT 6 OFFSET $1;";

            
            var postsResult = await client.query(sql, params);
            var posts = []
            console.log(postsResult.rows.length);
            for(let i=0;i<postsResult.rows.length;i++) {
                let postResult = postsResult.rows[i];
                sql1 = "SELECT username FROM users ";
                sql1 += "WHERE user_id = $1 ";
                var params1 = [Number(postResult.author_id)];

                var authorResult = await client.query(sql1, params1);

                sql2 = "SELECT name FROM subforum ";
                sql2 += "WHERE subforum_id = $1 ";
                var params2 = [Number(postResult.subforum_id)];

                var subforumResult = await client.query(sql2, params2);


                sql3 = "SELECT category_name FROM category ";
                sql3 += "WHERE post_id = $1;";
                params3 = [Number(postResult.post_id)];

                var categoryResults = await client.query(sql3, params3); //multiple categories
                var categoriesList = ''
                categoryResults.rows.forEach(categoryResult => {
                    categoriesList += categoryResult.category_name + ',';
                });

                // TODO: Retrieve files associated with the post, although that shouldn't be required for home page
                /*
                var sql4 = "SELECT file_name FROM post_file ";
                sql4 += "WHERE post_id = $1;";
                var params4 = [Number(post.rows[i].post_id)];

                var file_temp = await client.query(sql4, params4);
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
        }
        else { //logged in user
            

            var sql1 = "SELECT interests FROM user_interests ";
            sql1 += "WHERE user_id = $1;";
            var params = [
                req.user.user_id
            ];
            var interests = await client.query(sql1, params); //list of interests
            // console.log(interests.rows);

            var sql2 = "SELECT qualifications FROM user_qualifications ";
            sql2 += "WHERE user_id = $1;";
            var qualifications = await client.query(sql2, params); //list of qualifications
            // console.log(qualifications.rows);

            /* var sql3 = "SELECT about FROM about ";
            sql3 += "WHERE user_id = $1;";
            var about = await client.query(sql3, params); */


            var post_ids = [];
            var subforum_id = [];

            // According to user's interests
            for (var i = 0; i < interests.rows.length; i++) {
                params = [interests.rows[i].interests.replace(/ /g, " | ")];

                var sql1 = "SELECT post_id FROM category ";
                sql1 += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
                sql1 += "AND post_id IS NOT NULL;";
                var byCategory = await client.query(sql1, params);
                
                byCategory.rows.forEach(row => post_ids.push(row.post_id));


                var sql2 = "SELECT post_id FROM post ";
                sql2 += "WHERE to_tsvector(title) @@ to_tsquery($1) OR ";
                sql2 += "to_tsvector(content) @@ to_tsquery($1);";
                var byTitle = await client.query(sql2, params);
                
                byTitle.rows.forEach(row => post_ids.push(row.post_id));
            }
            
            // According to user's qualifications
            for (var i = 0; i < qualifications.rows.length; i++) {

                params = [
                    qualifications.rows[i].qualifications.replace(/ /g, " | "),
                ];


                var sql1 = "SELECT post_id FROM category ";
                sql1 += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
                sql1 += "AND post_id IS NOT NULL;";
                var byCategory = await client.query(sql1, params);

                byCategory.rows.forEach(row => post_ids.push(row.post_id));
               
                var sql2 = "SELECT post_id FROM post ";
                sql2 += "WHERE to_tsvector(title) @@ to_tsquery($1) OR ";
                sql2 += "to_tsvector(content) @@ to_tsquery($1);";
                var byTitle = await client.query(sql2, params);

                byTitle.rows.forEach(row => post_ids.push(row.post_id));
            }

            /* // Accordint to about. WTH IS ABOUT?!
            var sql1 = "SELECT post_id FROM category ";
            sql1 += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
            sql1 += "AND post_id IS NOT NULL;";

            var sql2 = "SELECT post_id FROM post ";
            sql2 += "WHERE to_tsvector(title) @@ to_tsquery($1) OR ";
            sql2 += "to_tsvector(content) @@ to_tsquery($1);";

            var sql3 = "SELECT subforum_id FROM category ";
            sql3 += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
            sql3 += "AND subforum_id IS NOT NULL;";

            var sql4 = "SELECT subforum_id FROM subforum ";
            sql4 += "WHERE to_tsvector(name) @@ to_tsquery($1) OR ";
            sql4 += "to_tsvector(description) @@ to_tsquery($1)";

            params = [about.rows[0].about.replace(/ /g, " | ")];

            var temp1 = await client.query(sql1, params);
            var temp2 = await client.query(sql2, params);
            var temp3 = await client.query(sql3, params);
            var temp4 = await client.query(sql4, params);

            post_id = post_id.concat(temp1.rows, temp2.rows);
            subforum_id = subforum_id.concat(temp3.rows, temp4.rows); */

            post_ids = Array.from(new Set(post_ids));
            

            //sort on the basis of post_id in desc order(to get latest content on top)
            post_ids.sort((a, b) => Number(b) - Number(a));
            console.log(post_ids);
            var last_post;
            if (typeof req.query.post_id != 'undefined') {
                last_post = post_ids.findIndex((item) => {
                    return item == req.query.post_id;
                });
            } 
            else 
                last_post = 0;
            console.log(`last_post: ${last_post}`);
            var posts = []; // array of posts

            for (var i = last_post + 1; i < post_ids.length && i < 6; i++) { //6 -- no. posts on one lazy load
                var sql = "SELECT * FROM post ";
                sql += "WHERE post_id = $1 AND community_id IS NULL;";
                params = [post_ids[i]];
                var postResult = await client.query(sql, params);
                postResult = postResult.rows[0];
                // console.log(postResult.rows[0]);
                

                sql1 = "SELECT username FROM users ";
                sql1 += "WHERE user_id = $1 ";
                var params1 = [Number(postResult.author_id)];
                var authorResult = await client.query(sql1, params1);
                authorResult = authorResult.rows[0];

                sql2 = "SELECT name FROM subforum ";
                sql2 += "WHERE subforum_id = $1 ";
                var params2 = [Number(postResult.subforum_id)];
                var subforumResult = await client.query(sql2, params2);
                subforumResult = subforumResult.rows[0];
                if(typeof subforumResult == 'undefined')
                    subforumResult = {name: ""};

                sql3 = "SELECT category_name FROM category ";
                sql3 += "WHERE post_id = $1;";
                params3 = [Number(postResult.post_id)];
                var categoryResults = await client.query(sql3, params3); //multiple categories

                var categoriesList = ''
                categoryResults.rows.forEach(categoryResult => {
                    categoriesList += categoryResult.category_name + ',';
                });


                /*
                var sql4 = "SELECT file_name FROM post_file ";
                sql4 += "WHERE post_id = $1;";
                var params4 = [Number(post_temp.rows[0].post_id)];
                    var file_temp = await client.query(sql4, params4);
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
        if(posts.length == 0)
           data = {}
        else 
            data = {posts, last_post_id: posts[posts.length-1].post_id};
        res.json(data);
    } 
    catch (err) {
        console.log("ERROR IS : ", err);
    }
});


router.get('/get-subforums', async (req, res) => {
    console.log('[GET]: /home/get-subforums');
    const client = new Client({
        connectionString: connectionString
    });
    try {
        await client.connect();
        if (typeof req.user == 'undefined') {   // user not logged in
            console.log('User not logged in');
            
            if(typeof req.query.subforum_id != 'undefined') {
                console.log("query.subforum_id:" + req.query.subforum_id);
                sql = "SELECT COUNT(*) FROM subforum ";
                sql += "WHERE subforum_id >= $1;";
                var params = [
                    Number(req.query.subforum_id)
                ];
                var count_subforum = await client.query(sql, params);
                // console.log(count_subforum.rows);
                params = [
                    Number(count_subforum.rows[0].count)
                ]
            }
            else
                var params = [0];
            
            sql = "SELECT * FROM subforum ";
            sql += "ORDER BY subforum_id DESC ";
            sql += "LIMIT 6 OFFSET $1;";
            var subforumResults = await client.query(sql, params);
            var subforums = []
            for (let i = 0; i < subforumResults.rows.length; i++) {

                let subforumResult = subforumResults.rows[i];

                sql1 = "SELECT username FROM users ";
                sql1 += "WHERE user_id = $1 ";
                var params1 = [Number(subforumResult.creator_id)];

                var creatorResult = await client.query(sql1, params1);
                creatorResult = creatorResult.rows[0];


                sql3 = "SELECT category_name FROM category ";
                sql3 += "WHERE subforum_id = $1;";
                params3 = [Number(subforumResult.subforum_id)];

                var categoryResults = await client.query(sql3, params3); //multiple categories
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
        else {
            console.log('User is logged in!');

            var sql1 = "SELECT interests FROM user_interests ";
            sql1 += "WHERE user_id = $1;";
            var params = [
                req.user.user_id
            ];
            var interests = await client.query(sql1, params); //list of interests
            // console.log(interests.rows);

            var sql2 = "SELECT qualifications FROM user_qualifications ";
            sql2 += "WHERE user_id = $1;";
            var qualifications = await client.query(sql2, params); //list of qualifications
            // console.log(qualifications.rows);

            var subforum_ids = [];

            // According to user's interests
            for (var i = 0; i < interests.rows.length; i++) {
                params = [interests.rows[i].interests.replace(/ /g, " | ")];
                
                var sql3 = "SELECT subforum_id FROM category ";
                sql3 += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
                sql3 += "AND subforum_id IS NOT NULL;";

                var byCategory = await client.query(sql3, params);
                byCategory.rows.forEach(row => subforum_ids.push(row.subforum_id));
                var sql4 = "SELECT subforum_id FROM subforum ";
                sql4 += "WHERE to_tsvector(name) @@ to_tsquery($1) OR ";
                sql4 += "to_tsvector(description) @@ to_tsquery($1)";

                var byTitle = await client.query(sql4, params);
                byTitle.rows.forEach(row => subforum_ids.push(row.subforum_id));

            }

            // According to user's qualifications
            for (var i = 0; i < qualifications.rows.length; i++) {
                params = [
                    qualifications.rows[i].qualifications.replace(/ /g, " | "),
                ];

                var sql3 = "SELECT subforum_id FROM category ";
                sql3 += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
                sql3 += "AND subforum_id IS NOT NULL;";

                var byCategory = await client.query(sql3, params);
                byCategory.rows.forEach(row => subforum_ids.push(row.subforum_id));


                var sql4 = "SELECT subforum_id FROM subforum ";
                sql4 += "WHERE to_tsvector(name) @@ to_tsquery($1) OR ";
                sql4 += "to_tsvector(description) @@ to_tsquery($1)";

                var byTitle = await client.query(sql4, params);
                byTitle.rows.forEach(row => subforum_ids.push(row.subforum_id));

            }

            //removing duplicates
            subforum_ids = Array.from(new Set(subforum_ids));
            console.log(subforum_ids);

            //sort on the basis of subforum_id in desc order(to get latest content on top)
            subforum_ids.sort((a, b) => Number(b) - Number(a));

            var subforums = [];
            var last_subforum;
            if (typeof req.query.subforum_id != 'undefined') {
                last_subforum = subforum_ids.findIndex((item) => {
                    return item == req.query.subforum_id;
                });
            } else
                last_subforum = 0;
            console.log(`last_subforum: ${last_subforum}`);

            for (var i = last_subforum + 1; i < subforum_ids.length && i < 6; i++) {
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
            last_subforum_id: subforums[subforums.length-1].subforum_id
        };
        res.json(data);
    }
    catch(err) {
        console.log('[ERROR]: In /home/get-subforums');
        console.error(err);
    }
});


module.exports = router;