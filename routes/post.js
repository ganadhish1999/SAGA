/*
    post/
        /create
        /delete
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
    res.sendFile('C:/Users/SHAHS/Documents/ArnavCode/projects/forum/SAGA/public/index.html');
})

router.post('/create', upload.array('myFile', 10), (req, res) => {
    var data = [];
    res.send('hello');
    // console.log("post body ", req.body);
    const client = new Client({ connectionString: connectionString });
    // console.log(req.files);

    for (var i = 0; i < req.files.length; i++) {
        data.push(fs.readFileSync(
            "C:/Users/SHAHS/Documents/ArnavCode/projects/forum/SAGA/public/uploads/postFiles/" +
            req.files[i].filename
        ));
    }
    //delete all files
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            //query 1
            var sql1 = "INSERT INTO post";
            sql1 += "(title,content,timestamp,author_id)";
            sql1 += "VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING *;";
            var params1 = [
                req.body.title,
                req.body.content,
                Number(req.body.author_id)
                // Number(req.body.subforum_id),      
                // Number(req.body.community_id)
            ];
            return client.query(sql1, params1);
        })
        .then((result) => {
            // console.log(result.rows);

            //query 2
            var sql2 = "INSERT INTO category";
            sql2 += "(category_name, post_id) ";
            sql2 += "(SELECT $2, post_id FROM post ";
            sql2 += "WHERE post_id = $1);";
            var params2 = [
                Number(result.rows[0].post_id),
                req.body.category
            ];
            var query2 = client.query(sql2, params2);

            //query 3
            query_return = [];

            for (var i = 0; i < req.files.length; i++) {
                var sql3 = "INSERT INTO post_file ";
                sql3 += "(file_data, file_ext, post_id) ";
                sql3 += "VALUES ($1, $2, $3);";
                var params3 = [
                    data[i],
                    path.extname(req.files[i].originalname),
                    Number(result.rows[0].post_id)
                ];
                query_return.push(client.query(sql3, params3));
            }
            query_return.push(query2);
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
            var sql3 = "DELETE FROM post ";
            sql3 += "WHERE post_id = $1 AND author_id = $2;";
            var params = [
                Number(req.body.post_id),
                Number(req.body.author_id)
            ];

            var query1 = client.query(sql1, params);
            var query2 = client.query(sql2, params);
            var query3 = client.query(sql3, params);
            return [query1, query2, query3];
        })
        .then((result) => {
            console.log("done");
        })
        .catch((err) => {
            console.log("error is: ", err);
        });
    return res.redirect('/home');
});


module.exports = router;