/*
    home/
        /about
        /qualifications
        /interests
*/

const express = require('express');
const { Client } = require('pg');
const router = express.Router();

const { connectionString } = require("../config/keys");


router.get('/', (req, res) => {
    res.send('hello');
    //posts, subforums, communities, chats(right sidebar)


});


router.post('/:search', (req, res) => {
    res.send("hello");
    //display searched post, subforums, communities.
});


module.exports = router;