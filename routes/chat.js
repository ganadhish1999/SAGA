/*
    chat/
        /message
*/


const express = require('express');
const { Client } = require('pg');
const router = express.Router();


const { connectionString } = require("../config/keys");


router.post('/', async(req, res) => {
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        await client.connect();

        var sql = "INSERT INTO chat (user1_id,user2_id,timestamp) ";
        sql += "VALUES ($1, $2, CURRENT_TIMESTAMP);";
        var params = [
            req.body.user1_id,
            req.body.user2_id
        ];
        var chat = await client.query(sql, params);
    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});


router.post("/message", async(req, res) => {
    res.send("hello");
    console.log("post body: ", req.body);
    const client = new Client({ connectionString: connectionString });
    await client.connect();

    var sql = "INSERT INTO message ";
    sql += "(content,sender_id,reciever_id,timestamp,chat_id) ";
    sql += "VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4);";
    var params = [
        req.body.content,
        Number(req.body.sender_id),
        Number(req.body.reciever_id),
        Number(req.body.chat_id)
    ];
    var message = await client.query(sql, params);
});


module.exports = router;