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
      socket: {},
      message: [],
      messageToSend: null,
      user: null,
    };
  },
  methods: {
    uuid: uuid,
    sendMessage: async function () {
      this.socket.emit("send-message", {
        message: this.messageToSend,
      });
    },
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
    showConsultants: function(){
      console.log("console")
      this.socket.emit("show-consultants-sockets")
    }
  },
  watch: {
    $route() {
      console.log("usuario desconectado por cambiar de vista");
      this.socket.disconnect();
    },
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
