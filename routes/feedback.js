const express = require('express');
const { Client } = require('pg');
const router = express.Router();


const { connectionString } = require("../config/keys");

router.get('/', (req, res) => {
    //feedback page
});

router.post('/', (req, res) => {
    res.send("hello");
    // console.log("post body ", req.body);
    const client = new Client({ connectionString: connectionString });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            var sql = "INSERT INTO feedback ";
            sql += "(content,timestamp,user_id) ";
            sql += "VALUES ($1, CURRENT_TIMESTAMP, $2);";
            var params = [
                req.body.content,
                req.body.user_id
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