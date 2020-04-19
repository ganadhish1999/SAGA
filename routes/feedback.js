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

        if (typeof req.query.feedback_id != 'undefined') {
            console.log("query.feedback_id:" + req.query.feedback_id);
            var params = [Number(req.query.feedback_id)];
        } else {
            var params = [Number.MAX_SAFE_INTEGER];
        }

        sql = "SELECT * FROM feedback WHERE feedback_id < $1 ";
        sql += "ORDER BY timestamp DESC ";
        sql += "LIMIT 6;";
        var feedbacks = await client.query(sql, params);

        var feedbackList = [];
        for (var i = 0; i < feedbacks.rows.length; i++) {
            sql = "SELECT username FROM users ";
            sql += "WHERE user_id = $1;";
            params = [
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