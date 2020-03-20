/*
    chat/
        /message
*/


const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const router = require('Router');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var conn = 'postgres://postgres:qwerty@localhost:5432/test';


router.post('/', (req, res) => {
    res.send("hello");
    console.log("post body: ", req.body);
    const client = new Client({ connectionString: conn });
    client
        .connect()
        .then(() => {
            var sql = "INSERT INTO chat (user1_id,user2_id,timestamp) ";
            sql += "VALUES ($1, $2, CURRENT_TIMESTAMP);";
            var params = [
                req.body.user1_id,
                req.body.user2_id
            ];
            return client.query(sql, params);
        })
        .then((result) => {
            console.log(result.rows);
        })
        .catch(err => {
            console.log("error is :", err);
        });
});


app.post("/message", (req, res) => {
    res.send("hello");
    console.log("post body: ", req.body);
    const client = new Client({ connectionString: conn });
    client
        .connect()
        .then(() => {
            var sql = "INSERT INTO message ";
            sql += "(content,sender_id,reciever_id,timestamp,chat_id) ";
            sql += "VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4);";
            var params = [
                req.body.content,
                Number(req.body.sender_id),
                Number(req.body.reciever_id),
                Number(req.body.chat_id)
            ];
            return client.query(sql, params);
        })
        .then(result => {
            console.log(result.rows);
        })
        .catch(err => {
            console.log("error is :", err);
        });
});


module.exports = router;