<template>
  <div>
    <h3>Chat Keybe</h3>
    <div>
      <div id="containerParent" class="container-fluid p-5">
        <div v-if="status.connected" class="row justify-content-center p-4">
          Connected
        </div>
        <div v-else class="row justify-content-center">
          Disconnected please wait
        </div>
        <div class="row justify-content-center">
          <div class="col d-flex justify-content-center">
            <div id="containerChat" class="container bg-light p-3">
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
                  <div 
                  v-bind:class="'d-flex justify-content-'+(msg.sender === user.username ? 'end' : 'left')" 
                  id="message">
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
                </div>
              </div>
              <div v-if="status.writing" id="writing">writing...</div>
            </div>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-xl-9 col-lg-10 col-md-11 col-sm-12">
            <div @keyup.enter="sendMessage" class="input-group mb-3">
              <input
                v-model="messageToSend"
                @input="imWriting"
                type="text"
                class="form-control"
                placeholder="Enter message"
                aria-label="Enter message"
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
                <button
                  @click="disconnect"
                  class="btn btn-outline-secondary"
                  type="button"
                  id="button-addon2"
                >
                  disconnect
                </button>
                <button
                  @click="showConsultants"
                  class="btn btn-outline-secondary"
                  type="button"
                  id="button-addon2"
                >
                  console
                </button>
              </div>
              <div class="input-group mb-3">
                <input
                  v-model="ticketToSend"
                  type="text"
                  class="form-control"
                  placeholder="Enter ticket"
                  aria-label="Enter ticket"
                  aria-describedby="button-addon2"
                />
                <button
                  @click="sendTicket"
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
</template>

<script>
import io from "socket.io-client";
import uuid from "../utils/uuid";

export default {
  name: "Chat",
  data: function () {
    return {
      status: {
        connected: null,
        writing: null,
      },
      socket: {},
      message: [],
      messageToSend: null,
      ticketToSend: null,
      user: null,
      toggle: false,
    };
  },
  methods: {
    uuid: uuid,
    sendTicket: async function () {
      console.log(this.ticketToSend);
      let token = sessionStorage.getItem("token");
      // console.log(token)
      let response = await fetch(
        "http://localhost:7474/api/auth/validate/ticket",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            ticket: this.ticketToSend,
          }),
        }
      );
      response = await response.json();
      console.log(response);
      if (response.validated) {
        this.socket.emit("match-chat-ticket", this.user, this.ticketToSend);
      }
    },
    imWriting: function () {
      if(this.status.connected){
      console.log(this.messageToSend.length);
      this.socket.emit("writing", this.messageToSend.length);
      }
    },
    sendMessage: async function () {
      if(this.status.connected){
      this.socket.emit("send-message", {
        message: this.messageToSend,
      });
      this.toggle = !this.toggle;
      }
    },
    disconnect: function () {
      this.socket.disconnect();
      this.$router.push("/login");
    },
    showConsultants: function () {
      console.log("console");
      this.socket.emit("show-consultants-sockets");
    },
  },
  watch: {
    $route() {
      console.log("usuario desconectado por cambiar de vista");
      this.socket.disconnect();
    },
    toggle() {
      this.status.writing = false;
      this.messageToSend = "";
      this.socket.emit("writing", this.messageToSend.length);
    },
        message() {
      setTimeout(() => {
        let chatContainer = document.getElementById("containerChat");
        chatContainer.scrollTop =
          chatContainer.scrollHeight + window.innerHeight;
      }, 400);
    },
  },

  created: function () {
    if (sessionStorage.getItem("token")) {
      this.user = JSON.parse(
        atob(sessionStorage.getItem("token").split(".")[1])
      );
    } else this.$router.push("/login");
    this.socket = io("http://localhost:7474");
    // this.socket.emit("identity", this.user);
  },
  mounted: function () {
    this.socket.on("sending-chat", (data) => {
      this.message = data.messages;
      console.log(`this is the chat : ${JSON.stringify(data.messages)}`);
    });
    this.socket.on("connected", (data) => {
      console.log("EVENTO CONNECTEEED TICKET");
      if (!data) this.status.connected = false;
      else this.status.connected = true;
    });
    this.socket.on("setWriting", (data) => {
      if (data) this.status.writing = true;
      else this.status.writing = false;
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
#containerParent {
  background: rgb(255, 255, 255);
  border-radius: 10px 40px 40px 40px;
}
#containerChat {
  background: rgb(248, 244, 244);
  height: 50vh;
  border-radius: 10px 40px 40px 40px;
  padding: 1em;
  overflow: auto;
  max-width: 1000px;
  margin: 0 auto 2em auto;
  box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.3);
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
