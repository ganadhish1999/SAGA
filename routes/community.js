/*
    community/
             /create
             /follow
             /delete
*/


const express = require('express');
const { Client } = require('pg');
const router = express.Router();

const { connectionString } = require("../config/keys");


router.post(['/', '/create'], async(req, res) => {
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        await client.connect();
        console.log("connection successful!");

        var sql = "INSERT INTO community";
        sql += "(name,description,timestamp,creator_id)";
        sql += "VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING *";
        var params = [
            req.body.name,
            req.body.description,
            Number(req.body.creator_id)
        ];
        var community = await client.query(sql, params);
    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});


router.post("/follow", async(req, res) => {
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        await client.connect();
        console.log("connection successful!");

        var sql = "INSERT INTO user_community ";
        sql += "(SELECT $2, community_id FROM community ";
        sql += "WHERE name=$1);";
        var params = [
            req.body.name,
            Number(req.body.user_id)
        ];
        var follow_community = await client.query(sql, params);
    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});


router.delete("/delete", async(req, res) => {
    res.send("hello");

    const client = new Client({ connectionString: connectionString });

    try {
        await client.connect();
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
        var sql3 = "DELETE FROM post_file ";
        sql3 += "WHERE post_id IN ";
        sql3 += "(SELECT post_id FROM post ";
        sql3 += "WHERE community_id IN ";
        sql3 += "(SELECT community_id FROM community ";
        sql3 += "WHERE community_id = $1 AND creator_id = $2));"
            //query 4
        var sql4 = "DELETE FROM post ";
        sql4 += "WHERE post_id IN ";
        sql4 += "(SELECT post_id FROM post ";
        sql4 += "WHERE community_id IN ";
        sql4 += "(SELECT community_id FROM community ";
        sql4 += "WHERE community_id = $1 AND creator_id = $2));"
            //query 4    
        var sql5 = "DELETE FROM user_community ";
        sql5 += "WHERE community_id IN ";
        sql5 += "(SELECT community_id FROM community ";
        sql5 += "WHERE community_id = $1 AND creator_id = $2);";
        //query 5
        var sql6 = "DELETE FROM community ";
        sql6 += "WHERE community_id = $1 AND creator_id = $2;";
        var params = [
            Number(req.body.community_id),
            Number(req.body.creator_id)
        ];
        var query1 = await client.query(sql1, params);
        var query2 = await client.query(sql2, params);
        var query3 = await client.query(sql3, params);
        var query4 = await client.query(sql4, params);
        var query5 = await client.query(sql5, params);
        var query6 = await client.query(sql6, params);
    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});


module.exports = router;