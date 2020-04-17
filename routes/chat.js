/*
    chat/
        /message
*/


const express = require('express');
const { Client } = require('pg');
const router = express.Router();
const userUtils = require('../utils/userUtils');


const { connectionString } = require("../config/keys");

router.get('/', (req, res) => {
    if(typeof req.user != 'undefined')
        res.render('chat', {user: req.user});
    else
        res.render('error-page', {
            err: 'You need to login to access this page'});
});



router.get('/:username', async (req, res) => {
    console.log(`Chat with ${req.params.username} requested!`);
    if (typeof req.user != 'undefined') {
        var userDetails = await userUtils.getUserDetails(req.params.username);
        console.log(userDetails);
        if(userDetails != undefined) {
            res.render('chat', {chatWithUser: userDetails, user: req.user});
        }
        else {
            res.render('error-page', {err: 'Unknown error', user: req.user} );
        }
    }
    else {
        res.render('error-page', {
            err: 'You need to login to access this page'
        });
    }
    
});

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


/* router.get('/user_data', async (req, res) => {

    if (req.user === undefined) {
        // The user is not logged in
        res.json({});
    } else {
        res.json({
            username: req.user
        });
    }
});
 */

module.exports = router;

const io = require('../server');
const moment = require("moment");

io.on("connect", socket => {
    // Send to connected user
    socket.emit("message", "Connected");

    console.log("A user connected");

    socket.on("joinRoom", async msg => {
        /*
                    1. See if request is valid, whether users exist. msg.user1 is the user who sent this message, msg.user2 is the other user, referred to here as chatWithUser
                    2. If room already exists, make this socket join the room and return the object:
                            {
                                header: 'ROOM JOINED',
                                chatWithUser: {
                                    fullname,
                                    username,
                                    imgSrc
                                },
                                roomName
                            } 
                    
                    3. If the room does not exist, create the room, and send the above object
                    4. If any errors, send a JSON having header 'ERROR', and a string property 'error'.
        */
        console.log("[SOCKETIO][joinRoom]");
        console.log(msg);

        try {
            const client = new Client({ connectionString: connectionString });
            await client.connect();
            console.log('conn successful');
            // Check if msg.user1 is indeed the user who has sent this message, otherwise a third person can easily hack into a chat. IDK how yet.

            if(msg.user1 == msg.user2)
                throw new Error('Tried joining a room with self!');

            let q1 = 'SELECT username, first_name, last_name, profile_image_name FROM users \
WHERE username=$1;';
            let p1 = [msg.user2];
            let r1 = await client.query(q1, p1);
            // console.log('r1:');
            // console.log(r1.rows);
            if(r1.rowCount == 0)
                throw new Error(`User ${msg.user2} does not exist`);
            let chatWithUser = {
                username: r1.rows[0].username,
                fullname: r1.rows[0].first_name + ' ' + r1.rows[0].last_name,
                imgSrc: r1.rows[0].profile_image_name
            };
            let user1 = msg.roomName.split('_')[0];
            let user2 = msg.roomName.split('_')[1];
            if(msg.user1 != user1 && msg.user1 != user2)
                throw new Error('Requesting user not part of requested room');
            let q2 = 'SELECT COUNT(*) FROM chat \
WHERE (user1=$1 AND user2=$2) \
OR (user1=$2 AND user2=$1);';
            let p2 = [user1, user2];
            let r2 = await client.query(q2, p2);
            console.log(r2.rows[0]);
            if(r2.rows[0].count == 0) { // Room does not exist, create it
                let q3 = 'INSERT INTO chat \
(user1, user2, time_of_creation) \
VALUES($1, $2, CURRENT_TIMESTAMP)';
                let p3 = [user1, user2];
                var insertResult = await client.query(q3, p3);
                console.log(insertResult);
            }

            socket.join(msg.roomName);
            socket.emit("system", {
                header: 'ROOM_JOINED',
                chatWithUser,
                roomName: msg.roomName
            });
           
        }
        catch(err) {
            console.error(err);
            socket.emit("system", {
                header: 'ERROR',
                error: err
            });
        }
    });

    socket.on("leaveRoom", msg => {
        console.log("[SOCKETIO][leaveRoom]");
        console.log(msg);
        // Check if msg.user is one of the users of the roomName
        socket.leave(msg.roomName);
    });

    socket.on("loadHistoryRequest", msg => {
        /* TODO
                    msg.roomName is the roomName whose message history is required.
                    msg.currentUser is the user who made the request.
                    Make a check if the currentUser is one of the two users of roomName 
                    Return the messages associated with this roomName sorted in chronological order. Maybe a for loop with emits would be enough. Or instead of using socketio, maybe a simple AJAX request would be good enough for this?
                    TRY USING AJAX FIRST */
    });

    socket.on("sendMessage", msg => {
        /* 
                    This is where the server acts as the middleman.
                    1. Error checks
                    2. Attach timestamp to message
                    3. Store the message in DB
                    4. Send it to the room
                */

        // For dev
        console.log("[SOCKETIO][sendMessage]:");
        console.log(msg);

        // msg.timestamp = moment().format("MMM D, hh:mm A"); // attach timestamp
        


        io.to(msg.roomName).emit("chatMessage", msg);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});