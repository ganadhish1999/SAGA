const io = require("./index");
const moment = require("moment");
io.on("connect", socket => {
    // Send to connected user
    socket.emit("message", "Connected");

    console.log("A user connected");

    socket.on("joinRoom", msg => {
        /* TODO
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

        // For development only:
        console.log("[SOCKETIO][joinRoom]");
        console.log(msg);
        socket.join(msg.roomName);
        socket.emit("system", {
            header: "ROOM_JOINED",
            chatWithUser: {
                username: msg.user2,
                fullname: "Full name to be given by server",
                imgSrc: "https://randomuser.me/api/portraits/men/1.jpg"
            },
            roomName: msg.roomName
        });
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

        msg.timestamp = moment().format("MMM D, hh:mm A"); // attach timestamp

        io.to(msg.roomName).emit("chatMessage", msg);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});