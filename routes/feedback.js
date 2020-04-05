const express = require('express');
const { Client } = require('pg');
const router = express.Router();


const { connectionString } = require("../config/keys");

router.get('/', (req, res) => {
    //feedback page
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        await client.connect();
        console.log("connection successful!");
        if (req.query) {
            var sql = "SELECT COUNT(*) FROM feedback ";
            sql += "WHERE feedback_id >= $1;";
            var params = [
                req.query.feedback_id
            ];
            var count = await client.query(sql, params);

            sql = "SELECT * FROM feedback ";
            sql += "ORDER BY timestamp DESC ";
            sql += "LIMIT 6 OFFSET $1";
            params = [
                Number(count.rows[0].count)
            ];
            var feedback = await client.query(sql);

            var user = [];
            for (var i = 0; i < feedback.rows.length; i++) {
                sql = "SELECT username FROM users ";
                sql += "WHERE user_id = $1;";
                var params = [
                    feedback.rows[i].user_id
                ];
                var user_temp = await client.query(sql, params);
                user.push(user_temp.rows[0]);
            }
            var data = {
                feedback: feedback.rows, //array of feedbacks --all column names
                user: user_temp //array of users --username
            };
        } else {
            var sql = "SELECT * FROM feedback ";
            sql += "ORDER BY timestamp DESC ";
            sql += "LIMIT 6;";
            var feedback = await client.query(sql);

            var user = [];
            for (var i = 0; i < feedback.rows.length; i++) {
                sql = "SELECT username FROM users ";
                sql += "WHERE user_id = $1;";
                var params = [
                    feedback.rows[i].user_id
                ];
                var user_temp = await client.query(sql, params);
                user.push(user_temp.rows[0]);
            }
            var data = {
                feedback: feedback.rows, //array of feedbacks --all column names
                user: user_temp //array of users --username
            };
        }

    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});

router.post('/', async(req, res) => {
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        await client.connect();
        console.log("connection successful!");

        var sql = "INSERT INTO feedback ";
        sql += "(content,timestamp,user_id) ";
        sql += "VALUES ($1, CURRENT_TIMESTAMP, $2);";
        var params = [
            req.body.content,
            req.body.user_id
        ];
        var feedback = await client.query(sql, params);
    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});


module.exports = router;