/*
    chat/
        /message
*/


const express = require('express');
const router = express.Router();
const userUtils = require('../utils/userUtils');
const pool = require('../config/db');


router.get('/', async(req, res) => { // breaks
    if (typeof req.user != 'undefined') {
        var userDetails = await userUtils.getUserDetailsById(req.user.user_id);
        try {
            var client = await pool.connect();
            // Get list of users req.user has chats with
            let q1 = 'SELECT user1, user2 FROM chat \
    WHERE user1=$1 OR user2=$1;'
            let p1 = [userDetails.username]
            let r1 = await client.query(q1, p1);
            console.log('r1:');
            console.log(r1.rows);

            var chatsList = [];
            for (let i = 0; i < r1.rows.length; i++) {
                let qUsername;
                if (r1.rows[i].user1 == userDetails.username)
                    qUsername = r1.rows[i].user2;
                else
                    qUsername = r1.rows[i].user1;
                let qUser = await userUtils.getUserDetailsByUsername(qUsername);
                qUser = {
                    username: qUser.username,
                    fullname: qUser.first_name + ' ' + qUser.last_name,
                    profile_image_name: '/uploads/profileImages/' + qUser.profile_image_name
                }
                chatsList.push(qUser);
            }
            client.release();
            console.log(chatsList);
            res.render('chat', { chatWithUser: userDetails, user: req.user, chatsList, title: "Chat" });
        } catch (err) {
            client.release();
            console.error(err);
            res.render('error-page', { err, user: req.user, title:"Error" });
        }
    } else {
        console.log('User not logged in ')
        res.render('error-page', {
            error: 'You need to login to access this page',
            title: "Error"
        });
    }
});



router.get('/:username', async(req, res) => {

    if (req.params.username != 'null' && typeof req.user != 'undefined') {
        console.log(`[GET]: /chat/:username Chat with ${req.params.username} requested!`);
        var chatWithUserDetails = await userUtils.getUserDetailsByUsername(req.params.username);
        if (chatWithUserDetails != 'undefined') {
            var userDetails = await userUtils.getUserDetailsById(req.user.user_id);

            try {
                var client = await pool.connect();
                // Get list of users req.user has chats with
                let q1 = 'SELECT user1, user2 FROM chat \
    WHERE user1=$1 OR user2=$1;'
                    // console.log(userDetails.username);
                let p1 = [userDetails.username]
                let r1 = await client.query(q1, p1);
                // console.log(r1.rows);

                var chatsList = [];
                for (let i = 0; i < r1.rows.length; i++) {
                    let qUsername;
                    if (r1.rows[i].user1 == userDetails.username)
                        qUsername = r1.rows[i].user2;
                    else
                        qUsername = r1.rows[i].user1;
                    let qUser = await userUtils.getUserDetailsByUsername(qUsername);
                    qUser = {
                        username: qUser.username,
                        fullname: qUser.first_name + ' ' + qUser.last_name,
                        profile_image_name: '/uploads/profileImages/' + qUser.profile_image_name
                    }
                    chatsList.push(qUser);
                }
                // console.log(chatsList);
                client.release();
                res.render('chat', { chatWithUser: chatWithUserDetails, user: req.user, chatsList, title: "Chat" });
            } catch (err) {
                client.release();
                console.error(err);
                res.render('error-page', { err, user: req.user, title:"Error" });
            }
        } else {
            res.render('error-page', { err: 'Unknown error', user: req.user, title: 'Error' });
        }
    } else if (typeof req.user != 'undefined') {
        res.send({});
    } else {
        res.render('error-page', {
            error: 'You need to login to access this page', 
            title: "Error"
        });
    }

});


router.post('/load-history', async(req, res) => {
    /* Retrieve this chat from table chat
     * If req.user is one of the users of the chat, continue
     * else error
     * Retrieve the latest MAGIC_NUMBER posts, prior to the message_id provided in body
     * Send JSON with list of formatted messages and oldest message_id
     */
    // console.log(req.body);
    console.log(`[POST]: /chat/load-history/\n\tchat_id=${req.body.chat_id},\n\tusername=${req.body.username},\n\tmessage_id=${req.body.message_id}`);
    if (typeof req.user == 'undefined') {
        res.render('error-page', { err: 'You need to login to access this page' });
        return;
    }
    try {
        var client = await pool.connect();
        // console.log("connection successful!");

        let q1 = 'SELECT COUNT(*) FROM chat \
WHERE chat_id=$1 \
AND (user1=$2 OR user2=$2);';
        let p1 = [req.body.chat_id, req.body.username];
        let r1 = await client.query(q1, p1);
        if (r1.rows[0].count == 0)
            throw new Error('Chat does not exist');

        var last_msg = 999999;
        if (typeof req.body.message_id != 'undefined')
            last_msg = req.body.message_id;
        // console.log(last_msg);
        let q2 = 'SELECT * FROM message \
WHERE message_id<$1 AND chat_id=$2\
ORDER BY message_id DESC \
LIMIT 10;'
            // console.log('last msg id:');
            // console.log(Number(last_msg));
        let p2 = [Number(last_msg), Number(req.body.chat_id)];
        let r2 = await client.query(q2, p2);
        // console.log('MESSAGE QUERY RESULT:');
        // console.log(r2.rows.length);
        var messages = [];
        for (let i = 0; i < 10 && i < r2.rowCount; i++) {
            let msg = {
                chat_id: r2.rows[i].chat_id,
                message_id: r2.rows[i].message_id,
                timestamp: r2.rows[i].message_timestamp,
                sender: r2.rows[i].sender,
                receiver: r2.rows[i].receiver,
                content: r2.rows[i].content
            };
            // console.log(msg);
            messages.push(msg);
        }

        if (r2.rowCount != 0) {
            let data = {
                messages,
                last_message_id: messages[messages.length - 1].message_id
            };
            res.json(data);
        } else
            res.json({});
        client.release();

    } catch (err) {
        client.release();
        console.error(err);
        res.status(400).send({
            message: err
        });
    }


});


/* router.get('/user_data', async (req, res) => {

    if (req.user === 'undefined') {
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
            var client = await pool.connect();
            // console.log('conn successful');
            // Check if msg.user1 is indeed the user who has sent this message, otherwise a third person can easily hack into a chat. IDK how yet.

            if (msg.user1 == msg.user2)
                throw new Error('Tried joining a room with self!');

            let q1 = 'SELECT username, first_name, last_name, profile_image_name FROM users \
WHERE username=$1;';
            let p1 = [msg.user2];
            let r1 = await client.query(q1, p1);
            // console.log('r1:');
            // console.log(r1.rows);
            if (r1.rowCount == 0)
                throw new Error(`User ${msg.user2} does not exist`);
            let chatWithUser = {
                username: r1.rows[0].username,
                fullname: r1.rows[0].first_name + ' ' + r1.rows[0].last_name,
                imgSrc: "/uploads/profileImages/" + r1.rows[0].profile_image_name
            };

            // Following check results in a big bug. What if users have underscores in their usernames?
            /*
            let user1 = msg.roomName.split('_')[0];
            let user2 = msg.roomName.split('_')[1];
            if(msg.user1 != user1 && msg.user1 != user2)
                throw new Error('Requesting user not part of requested room');
            */
            let user1 = msg.user1,
                user2 = msg.user2;
            let q2 = 'SELECT chat_id FROM chat \
WHERE (user1=$1 AND user2=$2) \
OR (user1=$2 AND user2=$1);';
            let p2 = [user1, user2];
            let r2 = await client.query(q2, p2);
            // console.log(r2.rows[0]);
            var chat_id;
            if (r2.rowCount == 0) { // Room does not exist, create it
                let q3 = 'INSERT INTO chat \
(user1, user2, time_of_creation) \
VALUES($1, $2, CURRENT_TIMESTAMP) \
RETURNING chat_id;';
                let p3 = [user1, user2];
                var insertResult = await client.query(q3, p3);
                console.log(insertResult.rows[0].chat_id);
                chat_id = insertResult.rows[0].chat_id;
            } else { // Room exists, just query for chat_id
                chat_id = r2.rows[0].chat_id;
            }
            client.release();
            socket.join(msg.roomName);
            socket.emit("system", {
                header: 'ROOM_JOINED',
                chatWithUser,
                chat_id,
                roomName: msg.roomName
            });
            
        } catch (err) {
            client.release();
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

    /*socket.on("loadHistoryRequest", msg => {
         TODO
                    msg.roomName is the roomName whose message history is required.
                    msg.currentUser is the user who made the request.
                    Make a check if the currentUser is one of the two users of roomName 
                    Return the messages associated with this roomName sorted in chronological order. Maybe a for loop with emits would be enough. Or instead of using socketio, maybe a simple AJAX request would be good enough for this?
                    TRY USING AJAX FIRST 
    });*/

    socket.on("sendMessage", async msg => {
        /* 
            This is where the server acts as the middleman.
            1. Error checks // NOT DONE!
            2. Attach timestamp to message // Done
            3. Store the message in DB // Done
            4. Send it to the room // Done

            Format of msg: {
                chat_id,
                sender: currentUser,
                receiver: chatWithUser,
                content: message,
                roomName
            }
        */
        console.log("[SOCKETIO][sendMessage]:");
        console.log(msg);
        try {
            // Check 1: if requesting user is sender. Don't know how

            // Check 2: if msg.sender is part of  msg.roomName

            // Check 3: if chat exists. What if it doesn't?

            // Inserting into DB
            var client = await pool.connect();
            var q1 = 'INSERT INTO message \
(content, sender, receiver, message_timestamp, chat_id) \
VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4) \
RETURNING message_timestamp;';
            // console.log(msg.chat_id);
            var p1 = [
                msg.content,
                msg.sender,
                msg.receiver,
                Number(msg.chat_id)
            ]
            var r1 = await client.query(q1, p1);

            // Attach timestamp
            client.release();
            msg.timestamp = r1.rows[0].message_timestamp;
            // Send to room
            io.to(msg.roomName).emit("chatMessage", msg);
        } catch (err) {
            client.release();
            console.error(err);
            socket.emit("system", {
                header: 'ERROR',
                error: err
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});