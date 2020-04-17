var currentUser, roomName, chatWithUser, msgList, chatForm;

var setRoomName = (username = undefined) => {
	if (username == undefined) { // initially, say if 
		chatWithUser = document.querySelector(".chatwith-username");
		if(chatWithUser.innerText == '') {
			chatWithUser = currentUser;
		}
		else {
			chatWithUser = chatWithUser.innerText.slice(1);
		}
	} else {
		chatWithUser = username;
	}
	
	console.log(currentUser);
	console.log(chatWithUser);
	if (currentUser < chatWithUser) roomName = currentUser + "_" + chatWithUser;
	else if (currentUser > chatWithUser)
		roomName = chatWithUser + "_" + currentUser;
	else {
		console.error("Chatting with yourself!");
		// document.querySelector('#chat-window').innerHTML = "<p> Click on a user to chat with them </p>";
		document.querySelector('#chat-window').setAttribute('hidden', '');
		document.querySelector('#chat-window').parentElement.innerHTML += '<p>Click on a user to chat with them</p>';
	}
};


// Socket.io client
const socket = io();

let joinRoom = user => {
	console.log("chatwithuser in joinroom " + user);
	setRoomName(user); // redundant work at the first time this line is run
	socket.emit("joinRoom", {
		user1: currentUser,
		user2: user,
		roomName
	});
};

let leaveRoom = () => {
	socket.emit("leaveRoom", {
		user: currentUser,
		roomName
	});
	msgList = document.querySelector('#msg-list');
	if(msgList != undefined)
		msgList.innerHTML = '';
};

socket.on("chatMessage", msg => {
	console.log("NEW NESSAGE");
	console.log(msg);
	newMsg = document.createElement("msg-box");
	newMsg.setAttribute("content", msg.content);
	// Check if sender of message is the curr user or the other user
	if (msg.sender == chatWithUser) newMsg.setAttribute("type", "them");
	else if (msg.sender == currentUser) newMsg.setAttribute("type", "me");
	else console.error("Sender of message not in room!");

	// Set timestamp attribute. Write code for checking if it's the same day. If yes, then add only time
	newMsg.setAttribute("timestamp", msg.timestamp);

	msgList.appendChild(newMsg);
	msgList.scrollTop = msgList.scrollHeight;
});

let formatMessage = message => {
	console.log(roomName);
	return {
		sender: currentUser,
		receiver: chatWithUser,
		content: message,
		roomName
	};
};

socket.on("system", msg => {
	console.log(msg);
	if (msg.header == "ROOM_JOINED") {
		document.querySelector('#chat-window').removeAttribute('hidden');
		document.querySelector(".chatwith-user-fullname").innerText = msg.chatWithUser.fullname;
		document.querySelector(".chatwith-username").innerText = '@' + msg.chatWithUser.username;
		document.querySelector(".chatwith-user-pic").src = msg.chatWithUser.imgSrc;
		chatWithUser = msg.chatWithUser.username;
		roomName = msg.roomName;
		// socket.emit('loadHistoryRequest', {currentUser, roomName});
	}
	if (msg.header == "LOAD_HISTORY") {
		// Do some DOM!
		// Or maybe use AJAX for this.
	} else if (msg.header == "ERROR") {
		console.error("System returned error");
		console.error(msg.error);
	}
});

document.addEventListener("DOMContentLoaded", () => {
	currentUser = document.querySelector("#navbar-username").innerText.slice(1);
	setRoomName();
	console.log(`Room name: ${roomName}`);
	if(roomName != undefined) {
		joinRoom(chatWithUser);
		chatForm = document.querySelector("#chat-form");
		msgList = document.querySelector("#msg-list");

		console.log("currentUser: " + currentUser);
		console.log("chatWithUser: " + chatWithUser);

		chatForm.addEventListener("submit", e => {
			e.preventDefault();
			let msgContent = e.target.elements["msg-content"].value;
			if (msgContent == "") return;

			message = formatMessage(msgContent); // add sender, receiver, roomName
			// console.log("Sending a message");
			socket.emit("sendMessage", message);

			e.target.elements["msg-content"].value = "";
			e.target.elements["msg-content"].focus();
		});
	}
});