//used only for login register part

const { Client } = require('pg');

//db config
const db = require('../config/keys').connectionString;

//connect to postgres
const client = new Client({
    connectionString: db
})

client.connect()
    .then(() => console.log('postgresdb connected..'))
    .catch(err => console.log(err));


module.exports = client;