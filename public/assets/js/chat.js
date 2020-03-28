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
		}

		connectedCallback() {
			this.username = this.getAttribute("username");
			this.userFullname = this.getAttribute("name");
			this.imgSrc = this.getAttribute("avatar");
			
			this.shadowRoot.appendChild(userCardTemplate.content.cloneNode(true));
			this.shadowRoot.querySelector("#user-fullname").innerText = this.userFullname
			this.shadowRoot.querySelector("#username").textContent = this.username;
			this.shadowRoot.querySelector("#user-pic").src = this.imgSrc;
		}
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
    



// Socket.io client
const socket = io();
// socket.on('message', (message) => console.log(message));


var chatForm = document.querySelector('#chat-form');
var chatWindow = document.querySelector('#msg-list');

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let msgContent = e.target.elements['msg-content'].value;
    if(msgContent == '')    return;
    socket.emit('chatMessage', {msgContent:msgContent}); // add sender-receiver / room info
    e.target.elements['msg-content'].value = '';
    e.target.elements['msg-content'].focus();
});

socket.on('chatMessage', msg => {
    console.log(`Message: ${JSON.stringify(msg)}`);
    newMsg = document.createElement('msg-box');
    newMsg.setAttribute('content', msg.msgContent);
    // Check if sender of message is the curr user. If yes,
    // newMsg.setAttribute('type', 'me');
    // else
    newMsg.setAttribute('type', 'them');
    // Set timestamp attribute. Write code for checking if it's the same day. If yes, then add only time
    newMsg.setAttribute('timestamp', msg.timestamp);

    chatWindow.appendChild(newMsg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
});
