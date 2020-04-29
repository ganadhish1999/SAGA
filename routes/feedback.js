const express = require('express');
const router = express.Router();
const moment = require('moment');
const pool = require('../config/db');

router.get('/', async(req, res) => {
    console.log('/feedback');
    res.render('feedback', {
        user: req.user
    });
});

//query string should have feedback_id of last feedback displayed
router.get('/get-feedbacks', async(req, res) => {
    console.log('[GET]: /feedback/get-feedbacks');

    try {
        var client = await pool.connect();
        console.log("connection successful!");

        if (typeof req.query.feedback_id != 'undefined') {
            console.log("query.feedback_id:" + req.query.feedback_id);
            var params = [Number(req.query.feedback_id)];
        } else {
            var params = [Number.MAX_SAFE_INTEGER];
        }

        sql = "SELECT * FROM feedback WHERE feedback_id < $1 ";
        sql += "ORDER BY feedback_id DESC ";
        sql += "LIMIT 6;";
        var feedbacksResult = await client.query(sql, params);

        var feedbacks = [];
        for (var i = 0; i < feedbacksResult.rows.length; i++) {
            let feedbackResult = feedbacksResult.rows[i];
            sql = "SELECT username FROM users ";
            sql += "WHERE user_id = $1;";
            params = [
                Number(feedbackResult.user_id)
            ];
            var username = await client.query(sql, params);
            let feedback = {
                feedback_id: feedbackResult.feedback_id,
                content: feedbackResult.content,
                time: moment(feedbackResult.time_of_feedback).format("h:mm a"),
                date: moment(feedbackResult.time_of_feedback).format("MMM D, YYYY"),
                username: username.rows[0].username
            };
            feedbacks.push(feedback);
        }
        client.release();
        var data;
        if (feedbacks.length == 0) {
            data = {};
        } else {
            data = {
                feedbacks,
                last_feedback_id: feedbacks[feedbacks.length - 1].feedback_id
            };
        }
        res.json(data);
    } catch (err) {
        client.release();
        console.log("ERROR IS : ", err);
    }
});

router.post('/', async(req, res) => {
    res.send("hello");

    try {
        var client = await pool.connect();
        console.log("connection successful!");

        var sql = "INSERT INTO feedback ";
        sql += "(content,timestamp,user_id) ";
        sql += "VALUES ($1, CURRENT_TIMESTAMP, $2);";
        var params = [
            req.body.content,
            req.body.user_id
        ];
        var feedback = await client.query(sql, params);
        client.release();
    } catch (err) {
        client.release();
        console.log("ERROR IS : ", err);
    }
});


module.exports = router;