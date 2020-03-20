/*
    profile/
           /about
           /qualifications
           /interests
*/


const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const router = require('Router');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var conn = 'postgres://postgres:qwerty@localhost:5432/test';


router.get('/', (req, res) => {
    //display qualifications, interests, photo
    //list of posts,, subforums, communities, chats
});

router.post('/about', (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: conn });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            var sql = "INSERT INTO about";
            sql += "(about,user_id)";
            sql += "VALUES ($1, $2)";
            var params = [
                req.body.about,
                req.body.user_id
            ];
            return client.query(sql, params);
        })
        .then(result => {
            console.log("result: ", result.rows);
        })
        .catch(err => {
            console.log("error is: ", err);
        });
});

router.post('/qualifications', (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: conn });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            var sql = "INSERT INTO qualifications";
            sql += "(qualifications,user_id)";
            sql += "VALUES ($1, $2)";
            var params = [
                req.body.qualifications,
                req.body.user_id
            ];
            return client.query(sql, params);
        })
        .then(result => {
            console.log("result: ", result.rows);
        })
        .catch(err => {
            console.log("error is: ", err);
        });
});

router.post('/interests', (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: conn });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            var sql = "INSERT INTO interests";
            sql += "(interests,user_id)";
            sql += "VALUES ($1, $2)";
            var params = [
                req.body.interests,
                req.body.user_id
            ];
            return client.query(sql, params);
        })
        .then(result => {
            console.log("result: ", result.rows);
        })
        .catch(err => {
            console.log("error is: ", err);
        });
});


module.exports = router;