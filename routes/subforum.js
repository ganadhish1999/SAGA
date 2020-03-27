/*
    subforum/
            /create
            /follow
            /delete
*/


const express = require('express');
const { Client } = require('pg');
const router = express.Router();


const { connectionString } = require("../config/keys");


router.post(['/', '/create'], (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: connectionString });
    client
        .connect()
        .then(() => {
            var query_return = [];
            console.log("connection successful!");
            //query 1
            var sql1 = "INSERT INTO subforum";
            sql1 += "(name,description,timestamp,creator_id)";
            sql1 += "VALUES ($1, $2, CURRENT_TIMESTAMP, $3); ";
            var params1 = [
                req.body.name,
                req.body.description,
                Number(req.body.creator_id)
            ];
            query_return.push(client.query(sql1, params1));

            //query 2
            for (var i = 0; i < req.body.category.length; i++) {
                var sql2 = "INSERT INTO category";
                sql2 += "(category_name, subforum_id) ";
                sql2 += "(SELECT $2, subforum_id FROM subforum ";
                sql2 += "WHERE name = $1);"
                var params2 = [
                    req.body.name,
                    req.body.category[i]
                ];
                query_return.push(client.query(sql2, params2));
            }

            return query_return;
        })
        .then((result) => {
            console.log("done")
        })
        .catch((err) => {
            console.log("error is: ", err);
        });
});


router.post("/follow", (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: connectionString });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            var sql = "INSERT INTO user_subforum ";
            sql += "(SELECT $2, subforum_id FROM subforum ";
            sql += "WHERE name=$1);";
            var params = [
                req.body.name,
                Number(req.body.user_id)
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

router.delete("/delete", (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: connectionString });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            //query 1
            var sql1 = "DELETE FROM comment ";
            sql1 += "WHERE post_id IN ";
            sql1 += "(SELECT post_id FROM post ";
            sql1 += "WHERE subforum_id IN ";
            sql1 += "(SELECT subforum_id FROM subforum ";
            sql1 += "WHERE subforum_id = $1 AND creator_id = $2));";
            //query 2
            var sql2 = "UPDATE category ";
            sql2 += "SET post_id = NULL WHERE post_id IN  ";
            sql2 += "(SELECT post_id FROM post ";
            sql2 += "WHERE subforum_id IN ";
            sql2 += "(SELECT subforum_id FROM subforum ";
            sql2 += "WHERE subforum_id = $1 AND creator_id = $2));";
            //query 3
            var sql3 = "DELETE FROM post_file ";
            sql3 += "WHERE post_id IN ";
            sql3 += "(SELECT post_id FROM post ";
            sql3 += "WHERE subforum_id IN ";
            sql3 += "(SELECT subforum_id FROM subforum ";
            sql3 += "WHERE subforum_id = $1 AND creator_id = $2));"
                //query 4
            var sql4 = "DELETE FROM post ";
            sql4 += "WHERE post_id IN ";
            sql4 += "(SELECT post_id FROM post ";
            sql4 += "WHERE subforum_id IN ";
            sql4 += "(SELECT subforum_id FROM subforum ";
            sql4 += "WHERE subforum_id = $1 AND creator_id = $2));"
                //query 5    
            var sql5 = "DELETE FROM user_subforum ";
            sql5 += "WHERE subforum_id IN ";
            sql5 += "(SELECT subforum_id FROM subforum ";
            sql5 += "WHERE subforum_id = $1 AND creator_id = $2);";
            //query 6
            var sql5 = "UPDATE category ";
            sql6 += "SET subforum_id = NULL WHERE subforum_id IN  ";
            sql6 += "(SELECT subforum_id FROM subforum ";
            sql6 += "WHERE subforum_id = $1 AND creator_id = $2);";
            //query 7
            var sql7 = "DELETE FROM subforum ";
            sql7 += "WHERE subforum_id = $1 AND creator_id = $2;";
            var params = [
                Number(req.body.subforum_id),
                Number(req.body.creator_id)
            ];
            var query1 = client.query(sql1, params);
            var query2 = client.query(sql2, params);
            var query3 = client.query(sql3, params);
            var query4 = client.query(sql4, params);
            var query5 = client.query(sql5, params);
            var query6 = client.query(sql6, params);
            var query7 = client.query(sql7, params);

            return [query1, query2, query3, query4, query5, query6, query7];
        })
        .then((result) => {
            console.log("done");
        })
        .catch((err) => {
            console.log("error is: ", err);
        });
});


module.exports = router;