<template>
  <div>
    <h3>Chat Keybe</h3>
    <div>
      <div class="container-fluid bg-success rounded-lg">
        <div class="row justify-content-center">
          <div class="col d-flex justify-content-center">
            <div class="container bg-light rounded-lg p-3">
              <div
                v-bind:class="
                  'row justify-content-' +
                  (msg.sender === user.username ? 'end' : 'left') +
                  ' rounded-lg'
                "
                v-bind:key="msg.message.slice(0) + uuid() + 'index'"
                v-for="msg in message"
              >
                <div
                  class="col-6 shadow-lg bg-info text-white rounded-lg p-3 m-3"
                >
                  <div id="message">
                    {{ msg.sender !== "manu" ? msg.sender : msg.message }}:
                    {{ msg.sender === "manu" ? msg.sender : msg.message }}
                  </div>
                  <div
                    v-bind:class="
                      'd-flex justify-content-' +
                      (msg.sender === user.username ? 'end' : 'left')
                    "
                    id="date"
                  >
                    <strong>{{ msg.date }}</strong>
                  </div>
                  <div id="actions"></div>
                </div>
              </div>
              <div class="input-group mb-3">
                <input
                  v-model="messageToSend"
                  type="text"
                  class="form-control"
                  placeholder="Recipient's username"
                  aria-label="Recipient's username"
                  aria-describedby="button-addon2"
                />
                <div class="input-group-append">
                  <button
                    @click="sendMessage"
                    class="btn btn-outline-secondary"
                    type="button"
                    id="button-addon2"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import uuid from "../utils/uuid";

export default {
  name: "Chat",
  data: function () {
    return {
      socket: {},
      message: [],
      ticket: null,
      chatId: null,
      toSend: null,
      messageToSend: null,
      iteration: 0,
      user: null,
      receiver: "alf" /* poner dinamico este valor */,
    };
  },
  methods: {
    uuid: uuid,
    sendMessage: async function () {
      console.log(`this is the chatId: ${this.chatId}`)
      this.socket.emit("send-message", {
        receiver: this.receiver,
        sender: this.user.username,
        message: this.messageToSend,
        chatId: this.chatId,
        ticket: this.ticket
      });
      // this.socket.once("resend-message", (data) => {
      //   //console.log(`esta es el mensaje del back ${JSON.stringify(data)}`);
      //   this.message = data
      // });
      this.socket.once("sending-chat", (data) => {
        console.log(`esta es el mensaje del back ${JSON.stringify(data) }`);
        this.message = data.messages;
        if (!this.chatId) {
          this.chatId = data.chatId
          };
      });
    },
    join: async function () {
      // //console.log(this.user.username)
      this.socket.emit("loggedin", { username: this.user.username });
      this.socket.emit("want-to-chat");
      this.iteration += 1;
      // //console.log(this.iteration)
      await this.socket.once("Consultant", (data) => {
        // this.iteration += 1
        console.log(data);
        //console.log(`data : ${data} `);
      });

      // //console.log(this.iteration)
      // this.socket.emit("private message", this.socket.id, "ping")
      // this.socket.on("private message",(data,d) =>{
      //   //console.log("private message")
      //   //console.log(data,d)
    },
  },
  
  //   beforeRouteEnter: async function () {
  //     //console.log("beforeeeeeeeeeeeeeeeeeeeeeeeeeeee")
  //     const token = sessionStorage.getItem("token");
  //     if (!token) this.$router.push("/login");
  //     //console.log(`TOKEN : ${token}`);
  //     const response = await fetch(
  //       "http://localhost:7474/api/auth/validatetoken",
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "x-access-token": `${token}`,
  //         },
  //       }
  //     );
  //     const result = await response.json();
  //     //console.log(`result : ${result}`);
  //     if (!result.authenticated) {
  //       this.$router.push("/login")
  //     }
  //   },
  created: function () {
    //console.log(this.user);
    console.log("CREATED");
    this.user = JSON.parse(atob(sessionStorage.getItem("token").split(".")[1]));
    this.socket = io("http://localhost:7474");
  },
  mounted: function () {
    //console.log(this.user);
    console.log("MOUNTED");
    this.socket.on("message", (data) => {
      this.message = data;
      console.log(`esta es la data despues de 10 segundos : ${data}`);
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
