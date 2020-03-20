/*
    upvote, downvote not done yet(as separate path not wanted)

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
const router = require('Router');

//for port to be set as env var(other env vars can also be created(did not make database
//properties as env var due to issue))--use connection string instead
require('dotenv').config();


const app = express();


//postgres://postgres:password@host:port/database_name
//set password in pgAdmin4 in Login/group roles for postgres
//keep port as 5432
var conn = 'postgres://postgres:qwerty@localhost:5432/test';

module.exports = conn;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/home', require('./routes/home'));
app.use('/profile', require('./routes/profile'));
app.use('/post', require('./routes/post'));
app.use('/subforum', require('./routes/subforum'));
app.use('/community', require('./routes/community'));
app.use('/comment', require('./routes/comment'));
app.use('/chat', require('./routes/chat'));



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





app.listen(process.env.PORT || 3000, () => {
    console.log(`server is running... on port ${process.env.PORT}.`);
});