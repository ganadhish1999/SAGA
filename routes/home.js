/*
    home/
        /about
        /qualifications
        /interests
*/

const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const router = require('Router');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var conn = require('./server.js');


router.get('/', (req, res) => {
    //posts, subforums, communities, chats(right sidebar)
});


router.post('/:search', (req, res) => {
    //display searched post, subforums, communities.
});


module.exports = router;