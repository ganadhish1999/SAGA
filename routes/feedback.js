const express = require('express');
const { Client } = require('pg');
const router = express.Router();


const { connectionString } = require("../config/keys");

router.get('/', (req, res) => {
    //feedback page
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