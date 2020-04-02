document.addEventListener('DOMContentLoaded', () => {
	

	getCurrentUser = () => {
		var xhttp = new XMLHttpRequest();
		var url = 'user-data'
		xhttp.onreadystatechange = () => {
			if(xhttp.readyState == 4 && xhttp.status == 200) {
				var res = JSON.parse(xhttp.responseText);
				console.log(res['currentUser'])
				return res['currentUser'];
			}
		}
		xhttp.open("GET", url, false);
		xhttp.send();
	
	};
	
	getRoomName = (u1, u2) => {
		if(u1 < u2)	return u1 + '_' + u2;
		else if(u1 > u2)	return u2 + '_' + u1;
		else	console.error('Room name requested for identical usernames!');
		
	}

	var chatForm = document.querySelector('#chat-form');
	var chatWindow = document.querySelector('#msg-list');
	var currentUser = (getCurrentUser()).username ;
	var chatWithUser = document.querySelector('user-card').getAttribute('username');
	var roomName = getRoomName(currentUser, chatWithUser);

	chatForm.addEventListener('submit', (e) => {
		e.preventDefault();
		let msgContent = e.target.elements['msg-content'].value;
		if(msgContent == '')    return;
		
		message = formatMessage(msgContent);  // add sender-receiver / room info
	
		socket.emit('sendMessage', message);
		e.target.elements['msg-content'].value = '';
		e.target.elements['msg-content'].focus();
	});
});



// Socket.io client
const socket = io();
// socket.on('message', (message) => console.log(message));




formatMessage = (message) => {
	return {
		sender: currentUser,
		receiver: chatWithUser,
		content: message,
		room: roomName
	};
};



socket.on('system', msg => {
	msg = JSON.parse(msg);
	if(msg.header == 'ROOM_JOINED') {
		document.querySelector('.chatwith-user-fullname').innerText = msg.chatWithUser.fullname;
		document.querySelector('.chatwith-username').innerText = msg.chatWithUser.username;
		document.querySelector('.chatwith-user-pic').src = msg.chatWithUser.imgSrc;
		chatWithUser = msg.chatWithUser.username;
		roomName = msg.roomName;
		// socket.emit('loadHistoryRequest', {currentUser, roomName});
	}
	if(msg.header == 'LOAD_HISTORY') {
		// Do some DOM!
		// Or maybe use AJAX for this.
	}
	

	else if(msg.header == 'ERROR') {
		console.error('System returned error');
		console.error(msg.error);
	}
});

socket.on('chatMessage', msg => {
    console.log(`Message: ${JSON.stringify(msg)}`);
    newMsg = document.createElement('msg-box');
    newMsg.setAttribute('content', msg.msgContent);
	// Check if sender of message is the curr user or the other user
	if(msg.sender == chatWithUser)
		newMsg.setAttribute('type', 'them');
	else if(msg.sender == currentUser)
		newMsg.setAttribute('type', 'me');
	else	console.error('Sender of message not in room!');
	
    // Set timestamp attribute. Write code for checking if it's the same day. If yes, then add only time
    newMsg.setAttribute('timestamp', msg.timestamp);

    chatWindow.appendChild(newMsg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
});

joinRoom = (user) => {
	socket.emit("joinRoom", {
      user1: currentUser,
      user2: user.username
	});
	
};


const userCardTemplate = document.createElement("template");
	userCardTemplate.innerHTML = `<style>
#username {
    color: rgb(41, 160, 25);
    font-size: small;
}

#user-pic {
    width: 75%;
}
.user-div {
    margin: 10px 0px;
    border-top: 0.5px #ccc solid;
    border-bottom: 0.5px #ccc solid;
    border-left: 0.2px #ccc solid;
    border-right: 0.2px #ccc solid;
    border-radius: 3%;
	padding: 5px 0;
	cursor:pointer;
}
</style>
<script src="assets/js/jquery.min.js"></script>
<script src="assets/bootstrap/js/bootstrap.min.js"></script>
<link rel="stylesheet" href="/assets/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="/assets/fonts/font-awesome.min.css">
<link rel="stylesheet" href="/assets/fonts/ionicons.min.css">
<div class="user-div row">
<div class="col-4">
    <img alt="Profile pic" id="user-pic">
</div>
<div class="col-8 flex column" style="padding-left:0px">
    <span id="user-fullname"></span>
    <span id="username"></span>
</div>
</div>`;


	class UserCard extends HTMLElement {
		constructor() {
			super();
			
			this.attachShadow({ mode: "open" });
			this.shadowRoot.appendChild(userCardTemplate.content.cloneNode(true));

			this.username = this.getAttribute("username");
			this.userFullname = this.getAttribute("name");
			this.imgSrc = this.getAttribute("avatar");

			this.shadowRoot.querySelector("#user-fullname").innerText = this.userFullname
			this.shadowRoot.querySelector("#username").textContent = this.username;
			this.shadowRoot.querySelector("#user-pic").src = this.imgSrc;
		}
		

		connectedCallback() {
			this.shadowRoot.querySelector('.user-div').addEventListener('click', () => this.clickUser());
		}

		clickUser = () => {
			console.log(this.username + ' clicked');
			if(chatWithUser != this.username) {
				joinRoom(userData());
			}
			else	return;

		}

		userData = () => {
			return {
				username: this.username,
				fullname: this.userFullname,
				imgSrc: this.imgSrc
			};
		};
	}



	

	const msgTemplate = document.createElement('template');
	msgTemplate.innerHTML = `
	<style>
		.msg-content {
  		    font-size: 13px;
  		    line-height: 1.1;
		}
		.msg-timestamp {
  		    color: #918b8b;
		}
		.msg {
            max-width: 50%;
            width:max-content;
			margin: 12px;
			padding: 12px;
			padding-bottom: 8px;
		}
		.them {
 			background-color: #05f140bb;
		}
		.me {
            background-color: #fff;
        }
	</style>
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/bootstrap/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="/assets/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="/assets/fonts/font-awesome.min.css">
    <link rel="stylesheet" href="/assets/fonts/ionicons.min.css">
	<div class="border rounded shadow d-flex flex-column msg">
		<span class="msg-content">Message Content</span>
		<small class="align-self-end msg-timestamp">Time</small>
	</div>`;

	class Message extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({mode:'open'});
			this.shadowRoot.appendChild(msgTemplate.content.cloneNode(true));
		}
		connectedCallback() {
			this.content = this.getAttribute("content")
			this.timestamp = this.getAttribute("timestamp");
			this.type = this.getAttribute("type");
            console.log(this.type);
			this.shadowRoot.querySelector('.msg-content').innerText = this.content;
			this.shadowRoot.querySelector('.msg-timestamp').innerText = this.timestamp;
            this.shadowRoot.querySelector('div').classList.add(this.type);
            if(this.type === 'me')   this.shadowRoot.querySelector('div').classList.add('ml-auto'); 
		}
	}

	
window.customElements.define("user-card", UserCard);
window.customElements.define("msg-box", Message);
    


