/*
    upvote, downvote not done yet(as separate path not wanted)
    community delete same as subforum delete(difference mentioned below)
    profile, interests, qualifications not done
    user added(not login sign up)

 */

/*
    to installl - npm install package_name
        express
        bodyparser
        pg
        dotenv
        nodemon
*/

const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

//for port to be set as env var(other env vars can also be created(did not make database
//properties as env var due to issue))--use connection string instead
require('dotenv').config();

const app = express();


//postgres://postgres:password@host:port/database_name
//set password in pgAdmin4 in Login/group roles for postgres
//keep port as 5432
var conn = 'postgres://postgres:qwerty@localhost:5432/test';

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/add/user', (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: conn });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            var sql = "INSERT INTO users";
            sql += "(username,first_name,last_name,email,password,dob)";
            sql += "VALUES ($1, $2, $3, $4, $5, $6)";
            var params = [
                req.body.username,
                req.body.first_name,
                req.body.last_name,
                req.body.email,
                req.body.password,
                req.body.dob
            ];
            return client.query(sql, params);
        })
        .then(result => {
            console.log("result: ", result.rows);
        })
        .catch(err => {
            console.log("error is: ", err);
        });
});


app.post('/add/subforum', (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: conn });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            //query 1
            var sql1 = "INSERT INTO subforum";
            sql1 += "(name,description,timestamp,creator_id)";
            sql1 += "VALUES ($1, $2, CURRENT_TIMESTAMP, $3); ";
            //query 2
            var sql2 = "INSERT INTO category";
            sql2 += "(category_name, subforum_id) ";
            sql2 += "(SELECT $2, subforum_id FROM subforum ";
            sql2 += "WHERE name = $1);"
            var params1 = [
                req.body.name,
                req.body.description,
                Number(req.body.creator_id)
            ];
            var params2 = [
                req.body.name,
                req.body.category
            ];
            var query1 = client.query(sql1, params1);
            var query2 = client.query(sql2, params2);
            var result = [query1, query2];
        })
        .then(result => {
            // console.log("result: ", result[0].rows);
            // console.log("result: ", result[1].rows);
            console.log("hello")
        })
        .catch(err => {
            console.log("error is: ", err);
        });
});


app.post("/add/community", (req, res) => {
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
        .then(result => {
            console.log("result: ", result.rows);
        })
        .catch(err => {
            console.log("error is: ", err);
        });
});



app.post("/follow/subforum", (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: conn });
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
        .then(result => {
            console.log("result: ", result.rows);
        })
        .catch(err => {
            console.log("error is: ", err);
        });
});


app.post("/follow/community", (req, res) => {
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
        .then(result => {
            console.log("result: ", result.rows);
        })
        .catch(err => {
            console.log("error is: ", err);
        });
});


app.post("/add/subforum", (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: conn });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            //query 1
            var sql1 = "INSERT INTO subforum";
            sql1 += "(name,description,timestamp,creator_id)";
            sql1 += "VALUES ($1, $2, CURRENT_TIMESTAMP, $3); ";
            //query 2
            var sql2 = "INSERT INTO category";
            sql2 += "(category_name, subforum_id) ";
            sql2 += "(SELECT $2, subforum_id FROM subforum ";
            sql2 += "WHERE name = $1);";
            var params1 = [
                req.body.name,
                req.body.description,
                Number(req.body.creator_id)
            ];
            var params2 = [req.body.name, req.body.category];
            var query1 = client.query(sql1, params1);
            var query2 = client.query(sql2, params2);
            var result = [query1, query2];
        })
        .then(result => {
            // console.log("result: ", result[0].rows);
            // console.log("result: ", result[1].rows);
            console.log("hello");
        })
        .catch(err => {
            console.log("error is: ", err);
        });
});

app.post("/add/post", (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: conn });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            //query 1
            var sql1 = "INSERT INTO post";
            sql1 += "(title,content,timestamp,author_id,subforum_id)";
            sql1 += "VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4) RETURNING *;";
            var params1 = [
                req.body.title,
                req.body.content,
                Number(req.body.author_id),
                Number(req.body.subforum_id),
                // Number(req.body.community_id)
            ];
            return client.query(sql1, params1);
            // console.log(query1.rows);
        })
        .then(result => {
            console.log(result.rows);
            //query 2
            var sql2 = "INSERT INTO category";
            sql2 += "(category_name, post_id) ";
            sql2 += "(SELECT $2, post_id FROM post ";
            sql2 += "WHERE post_id = $1);";
            var params2 = [
                Number(result.rows[0].post_id),
                req.body.category
            ];
            return client.query(sql2, params2);
        }).then((result) => {
            console.log(result.rows);
        })
        .catch(err => {
            console.log("error is: ", err);
        });
});



app.post("/add/comment", (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: conn });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            var sql = "INSERT INTO comment ";
            sql += "(content,timestamp,author_id,post_id) ";
            sql += "VALUES ($1, CURRENT_TIMESTAMP, $2, $3);";
            var params = [
                req.body.content,
                Number(req.body.author_id),
                Number(req.body.post_id)
            ];
            return client.query(sql, params);
        })
        .then(result => {
            console.log("result: ", result.rows);
        })
        .catch(err => {
            console.log("error is: ", err);
        });
});


app.delete("/delete/post", (req, res) => {
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
            sql1 += "WHERE post_id = $1 AND author_id = $2);";
            //query 2
            var sql2 = "UPDATE category ";
            sql2 += "SET post_id = NULL WHERE post_id IN  ";
            sql2 += "(SELECT post_id FROM post ";
            sql2 += "WHERE post_id = $1 AND author_id = $2);";
            //query 3
            var sql3 = "DELETE FROM post ";
            sql3 += "WHERE post_id = $1 AND author_id = $2;";
            var params = [
                Number(req.body.post_id),
                Number(req.body.author_id)
            ];
            var query1 = client.query(sql1, params);
            var query2 = client.query(sql2, params);
            var query3 = client.query(sql3, params);
            return [query1, query2, query3];
        })
        .then(result => {
            console.log("hello");

        })
        .catch(err => {
            console.log("error is: ", err);
        });
});


//use almost all functionality for community(all but query 5)
app.delete("/delete/subforum", (req, res) => {
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
            var sql3 = "DELETE FROM post ";
            sql3 += "WHERE post_id IN ";
            sql3 += "(SELECT post_id FROM post ";
            sql3 += "WHERE subforum_id IN ";
            sql3 += "(SELECT subforum_id FROM subforum ";
            sql3 += "WHERE subforum_id = $1 AND creator_id = $2));"
                //query 4    
            var sql4 = "DELETE FROM user_subforum ";
            sql4 += "WHERE subforum_id IN ";
            sql4 += "(SELECT subforum_id FROM subforum ";
            sql4 += "WHERE subforum_id = $1 AND creator_id = $2);";
            //query 5
            var sql5 = "UPDATE category ";
            sql5 += "SET subforum_id = NULL WHERE subforum_id IN  ";
            sql5 += "(SELECT subforum_id FROM subforum ";
            sql5 += "WHERE subforum_id = $1 AND creator_id = $2);";
            //query 6
            var sql6 = "DELETE FROM subforum ";
            sql6 += "WHERE subforum_id = $1 AND creator_id = $2;";
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
            return [query1, query2, query3, query4, query5, query6];
        })
        .then(result => {
            console.log("hello");
        })
        .catch(err => {
            console.log("error is: ", err);
        });
});


app.delete('/delete/comment', (req, res) => {
    res.send("hello");
    console.log("post body: ", req.body);
    const client = new Client({ connectionString: conn });
    client
        .connect()
        .then(() => {
            var sql = "DELETE FROM comment WHERE comment_id = $1 ";
            sql += "AND author_id = $2;"
            var params = [
                req.body.comment_id,
                req.body.author_id
            ];
            return client.query(sql, params);
        })
        .then((result) => {
            console.log(result.rows);
        })
        .catch((err) => {
            console.log("error is :", err);
        })
});


app.post('/add/chat', (req, res) => {
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


app.post("/add/message", (req, res) => {
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


app.listen(process.env.PORT || 3000, () => {
    console.log(`server is running... on port ${process.env.PORT}.`);
});