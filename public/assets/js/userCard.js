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
    <span id="user-fullname"></span><br>
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

    this.shadowRoot.querySelector(
      "#user-fullname"
    ).innerText = this.userFullname;
    this.shadowRoot.querySelector("#username").textContent =
      "@" + this.username;
    this.shadowRoot.querySelector("#user-pic").src = this.imgSrc;
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector(".user-div")
      .addEventListener("click", () => this.clickUser());
  }

  userData() {
    return {
      username: this.username,
      fullname: this.userFullname,
      imgSrc: this.imgSrc
    };
  }
  clickUser() {
    // console.log(this.username + " clicked");
    if (chatWithUser != this.username) {
      leaveRoom();
      joinRoom(this.userData().username);
    } else return;
  }
}
window.customElements.define("user-card", UserCard);