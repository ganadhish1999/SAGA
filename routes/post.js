/*
    post/
        /create
        /delete
        /upvote
        /downvote
*/


const express = require('express');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();

const { connectionString } = require('../config/keys')


const storage = multer.diskStorage({
    destination: "./public/uploads/postFiles/",
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, //5mb
});

router.get(['/', '/create'], (req, res) => {
    res.sendFile(process.cwd() + '/public/index.html');
})

router.post('/create', upload.array('myFile', 10), (req, res) => {
    var data = [];
    res.send('hello');
    // console.log("post body ", req.body);
    const client = new Client({ connectionString: connectionString });
    // console.log(req.files);


    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            //query 
            var sql = "INSERT INTO post";
            sql += "(title,content,timestamp,author_id)";
            sql += "VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING *;";
            var params = [
                req.body.title,
                req.body.content,
                Number(req.body.author_id)
                // Number(req.body.subforum_id),      
                // Number(req.body.community_id)
            ];
            return client.query(sql1, params1);
        })
        .then((result) => {
            query_return = [];
            post_id = result.rows[0].post_id;

            //query 1
            for (var i = 0; i < req.body.category.length; i++) {
                var sql1 = "INSERT INTO category";
                sql1 += "(category_name, post_id) ";
                sql1 += "(SELECT $2, post_id FROM post ";
                sql1 += "WHERE post_id = $1);";
                var params1 = [
                    Number(post_id),
                    req.body.category[i]
                ];
                query_return.push(client.query(sql1, params1));
            }

            //renaming file 
            //format -- post_id + '-post-' + originalfilename
            for (var i = 0; i < req.files.length; i++) {
                var dir = process.cwd() + '/public/uploads/profileFiles/';
                var rename_from = dir + req.files[i].filename;
                var rename_to = dir + post_id + '-post-' + req.file[i].originalname;
                fs.renameSync(rename_from, rename_to, () => {
                    console.log("File Renamed!");
                });
            }

            //query 2
            for (var i = 0; i < req.files.length; i++) {
                var sql2 = "INSERT INTO post_file ";
                sql2 += "(file_name, post_id) ";
                sql2 += "VALUES ($1, $2);";
                var params2 = [
                    post_id + '-post-' + req.file[i].originalname,
                    Number(post_id)
                ];
                query_return.push(client.query(sql2, params2));
            }
            return query_return;
        })
        .then((result) => {
            console.log("done");
        })
        .catch((err) => {
            console.log("error is: ", err);
        });
});


router.delete("/delete", (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: connectionString });
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
            var sql3 = "DELETE FROM post_file ";
            sql3 += "WHERE post_id = $1 AND author_id = $2;";

            //query 4
            var sql4 = "DELETE FROM post ";
            sql4 += "WHERE post_id = $1 AND author_id = $2;";

            var params = [
                Number(req.body.post_id),
                Number(req.body.author_id)
            ];

            var query1 = client.query(sql1, params);
            var query2 = client.query(sql2, params);
            var query3 = client.query(sql3, params);
            var query4 = client.query(sql4, params);
            return [query1, query2, query3, query4];
        })
        .then((result) => {
            console.log("done");
        })
        .catch((err) => {
            console.log("error is: ", err);
        });
    return res.redirect('/home');
});


router.post('/upvotes', (req, res) => {
    res.send("hello");
    // console.log("post body ", req.body);
    const client = new Client({ connectionString: connectionString });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            var sql = "UPDATE post ";
            sql += "SET upvotes = upvotes + 1 ";
            sql += "WHERE post_id = $1;";
            var params = [
                Number(req.body.post_id)
            ];
            return client.query(sql, params);
        })
        .then((result) => {
            console.log("done");
        })
        .catch((err) => {
            console.log("error is: ", err);
        });
});

router.post('/downvotes', (req, res) => {
    res.send("hello");
    // console.log("post body ", req.body);
    const client = new Client({ connectionString: connectionString });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            var sql = "UPDATE post ";
            sql += "SET downvotes = downvotes + 1 ";
            sql += "WHERE post_id = $1;";
            var params = [
                Number(req.body.post_id)
            ];
            return client.query(sql, params);
        })
        .then((result) => {
            console.log("done");
        })
        .catch((err) => {
            console.log("error is: ", err);
        });
});


module.exports = router;