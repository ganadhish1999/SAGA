const msgTemplate = document.createElement("template");
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
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(msgTemplate.content.cloneNode(true));
  }
  connectedCallback() {
    this.content = this.getAttribute("content");
    this.timestamp = this.getAttribute("timestamp");
    this.type = this.getAttribute("type");
    // console.log(this.type);
    this.shadowRoot.querySelector(".msg-content").innerText = this.content;
    this.shadowRoot.querySelector(".msg-timestamp").innerText = this.timestamp;
    this.shadowRoot.querySelector("div").classList.add(this.type);
    if (this.type === "me")
      this.shadowRoot.querySelector("div").classList.add("ml-auto");
  }
}

window.customElements.define("msg-box", Message);
