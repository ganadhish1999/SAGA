/*
    community/
             /create
             /follow
             /delete
*/


const express = require('express');
const { Client } = require('pg');
const router = express.Router();

var conn = 'postgres://postgres:qwerty@localhost:5432/test';


router.post(['/', '/create'], (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: conn });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            var sql = "INSERT INTO community";
            sql += "(name,description,timestamp,creator_id)";
            sql += "VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING *";
            var params = [
                req.body.name,
                req.body.description,
                Number(req.body.creator_id)
            ];
            return client.query(sql, params);
        })
        .then((result) => {
            console.log("result: ", result.rows);
        })
        .catch((err) => {
            console.log("error is: ", err);
        });
});


router.post("/follow", (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: conn });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            var sql = "INSERT INTO user_community ";
            sql += "(SELECT $2, community_id FROM community ";
            sql += "WHERE name=$1);";
            var params = [
                req.body.name,
                Number(req.body.user_id)
            ];
            return client.query(sql, params);
        })
        .then((result) => {
            console.log("result: ", result.rows);
        })
        .catch((err) => {
            console.log("error is: ", err);
        });
});


router.delete("/delete", (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: conn });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            //query 1
            var sql1 = "DELETE FROM comment ";
            sql1 += "WHERE post_id IN ";
            sql1 += "(SELECT post_id FROM post ";
            sql1 += "WHERE community_id IN ";
            sql1 += "(SELECT community_id FROM community ";
            sql1 += "WHERE community_id = $1 AND creator_id = $2));";
            //query 2
            var sql2 = "UPDATE category ";
            sql2 += "SET post_id = NULL WHERE post_id IN  ";
            sql2 += "(SELECT post_id FROM post ";
            sql2 += "WHERE community_id IN ";
            sql2 += "(SELECT community_id FROM community ";
            sql2 += "WHERE community_id = $1 AND creator_id = $2));";
            //query 3
            var sql3 = "DELETE FROM post ";
            sql3 += "WHERE post_id IN ";
            sql3 += "(SELECT post_id FROM post ";
            sql3 += "WHERE community_id IN ";
            sql3 += "(SELECT community_id FROM community ";
            sql3 += "WHERE community_id = $1 AND creator_id = $2));"
                //query 4    
            var sql4 = "DELETE FROM user_community ";
            sql4 += "WHERE community_id IN ";
            sql4 += "(SELECT community_id FROM community ";
            sql4 += "WHERE community_id = $1 AND creator_id = $2);";
            //query 5
            var sql5 = "DELETE FROM community ";
            sql5 += "WHERE community_id = $1 AND creator_id = $2;";
            var params = [
                Number(req.body.community_id),
                Number(req.body.creator_id)
            ];
            var query1 = client.query(sql1, params);
            var query2 = client.query(sql2, params);
            var query3 = client.query(sql3, params);
            var query4 = client.query(sql4, params);
            var query5 = client.query(sql5, params);
            return [query1, query2, query3, query4, query5, query6];
        })
        .then((result) => {
            console.log("hello");
        })
        .catch((err) => {
            console.log("error is: ", err);
        });
});


module.exports = router;