<template>
  <div>
    <h3>Chat Keybe</h3>
    <div>
      <div class="container-fluid bg-success rounded-lg">
        <div v-if="status.connected" class="row justify-content-center p-4">
          Connected
        </div>
        <div v-else class="row justify-content-center">
          Disconnected please wait
        </div>
        <div class="row justify-content-center">
          <div class="col d-flex justify-content-center">
            <div id="containerChat" class="container bg-light rounded-lg p-3">
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
                  <div id="date"
                    v-bind:class="
                      'd-flex justify-content-' +
                      (msg.sender === user.username ? 'end' : 'left')
                    "
                  >
                    <strong>{{ msg.date }}</strong>
                  </div>
                </div>
              </div>
              <div v-if="status.writing" id="writing">writing...</div>
              <div class="input-group mb-3">
                <input
                  v-model="messageToSend"
                  id="messageBox"
                  @input="imWriting"
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
                  <br />
                  <button
                    @click="disconnect"
                    class="btn btn-outline-secondary"
                    type="button"
                    id="button-addon2"
                  >
                    disconnet
                  </button>
                  <button
                    @click="showConsultants"
                    class="btn btn-outline-secondary"
                    type="button"
                    id="button-addon2"
                  >
                    console
                  </button>
                  <button
                    v-if="user.rol === '1'"
                    @click="done"
                    class="btn btn-outline-secondary"
                    type="button"
                    id="button-addon2"
                  >
                    done
                  </button>
                  <button
                    v-if="user.rol === '1'"
                    @click="ticketGeneration"
                    class="btn btn-outline-secondary"
                    type="button"
                    id="button-addon2"
                  >
                    ticket
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
      status: {
        connected: null,
        writing: null,
      },
      socket: {},
      message: [],
      messageToSend: null,
      user: null,
      toggle:false
    };
  },
  methods: {
    uuid: uuid,
    sendMessage: async function () {
      this.socket.emit("send-message", {
        message: this.messageToSend,
      });
      this.toggle =!this.toggle
    },
    imWriting:function(){
      console.log(this.messageToSend.length)
      this.socket.emit("writing",this.messageToSend.length)
    }
    ,
    disconnect: function () {
      this.socket.disconnect();
      this.$router.push("/login");
    },
    done: function () {
      this.socket.emit("done-consultant", true);
      this.message = [];
    },
    ticketGeneration: function () {
      console.log("enviando algo");
      this.socket.emit("generate-ticket", true);
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
    toggle(){
      this.status.writing=false
      this.messageToSend=""
      this.socket.emit("writing",this.messageToSend.length)

    }
  },

  created: function () {
    if (sessionStorage.getItem("token")) {
      this.user = JSON.parse(
        atob(sessionStorage.getItem("token").split(".")[1])
      );
    } else this.$router.push("/login");
    this.socket = io("http://localhost:7474");
    this.socket.emit("identity", this.user);
  },
  mounted: function () {
    this.socket.on("sending-chat", (data) => {
      this.message = data.messages;
      console.log(`this is the chat : ${JSON.stringify(data.messages)}`);
    });
    this.socket.on("connected", (data) => {
      if (!data) this.status.connected = false;
      else this.status.connected = true;
    });
    this.socket.on("setWriting", data=>{
      if(data)this.status.writing = true;
      else this.status.writing = false;
    })
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* #containerChat{
background: white;
  height: 50vh;
  padding: 1em;
  overflow: auto;
  max-width: 350px;
  margin: 0 auto 2em auto;
  box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.3)} */

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
