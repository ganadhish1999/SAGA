const express = require('express');
const { Client } = require('pg');
const router = express.Router();


const { connectionString } = require("../config/keys");

//query string should have feedback_id of last feedback displayed
router.get('/', async(req, res) => {
    //feedback page
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        await client.connect();
        console.log("connection successful!");
        if (req.query.feedback_id) {

            sql = "SELECT * FROM feedback WHERE feedback_id < $1 ";
            sql += "ORDER BY timestamp DESC ";
            sql += "LIMIT 6;";
            params = [
                req.query.feedback_id
            ];
            var feedbacks = await client.query(sql, params);

            var feedbackList = [];
            for (var i = 0; i < feedbacks.rows.length; i++) {
                sql = "SELECT username FROM users ";
                sql += "WHERE user_id = $1;";
                var params = [
                    Number(feedbacks.rows[i].user_id)
                ];
                var username = await client.query(sql, params);
            }
            let feedback = {
                content: feedbacks.rows[i].content,
                time: moment(feedbacks.time_of_feedback).format("h:mm a"),
                date: moment(feedbacks.time_of_feedback).format("MMM D, YYYY"),
                username: username.rows[0].username
            };
            feedbackList.push(feedback);
            var data = {
                feedback: feedbackList
            };
        } else {
            sql = "SELECT * FROM feedback ";
            sql += "ORDER BY timestamp DESC ";
            sql += "LIMIT 6;";
            params = [
                req.query.feedback_id
            ];
            var feedbacks = await client.query(sql, params);

            var feedbackList = [];
            for (var i = 0; i < feedbacks.rows.length; i++) {
                sql = "SELECT username FROM users ";
                sql += "WHERE user_id = $1;";
                var params = [
                    Number(feedbacks.rows[i].user_id)
                ];
                var username = await client.query(sql, params);
            }
            let feedback = {
                content: feedbacks.rows[i].content,
                time: moment(feedbacks.time_of_feedback).format("h:mm a"),
                date: moment(feedbacks.time_of_feedback).format("MMM D, YYYY"),
                username: username.rows[0].username
            };
            feedbackList.push(feedback);
            var data = {
                feedback: feedbackList
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