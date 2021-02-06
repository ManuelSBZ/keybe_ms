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
                  (msg.sender === 'manu' ? 'end' : 'left') +
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
                      (msg.sender === 'manu' ? 'end' : 'left')
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
  name: "HelloWorld",
  props: {
    msg: String,
  },
  methods: {
    uuid: uuid,
    sendMessage: async function () {
      this.socket.emit("send-message", {
        receiver: this.receiver,
        sender: this.user.username,
        message: this.messageToSend,
      });
      this.socket.once("resend-message", (data) => {
        console.log(`esta es el mensaje del back ${JSON.stringify(data)}`);
        this.message = data
      });
    },
    join: async function () {
      // console.log(this.user.username)
      this.socket.emit("loggedin", { username: this.user.username });
      this.socket.emit("want-to-chat");
      this.iteration += 1;
      // console.log(this.iteration)
      await this.socket.once("Consultant", (data) => {
        // this.iteration += 1
        console.log(`data : ${data} `);
      });

      // console.log(this.iteration)
      // this.socket.emit("private message", this.socket.id, "ping")
      // this.socket.on("private message",(data,d) =>{
      //   console.log("private message")
      //   console.log(data,d)
    },
  },
  data: function () {
    return {
      socket: {},
      message: [
        {
          sender: "manu",
          receiver: "alf",
          message: "Hola necesito hacer un reclamo",
          date: "06:54",
        },
        {
          sender: "alf",
          receiver: "manu",
          message: "claro en seguida lo atiendo!!",
          date: "06:56",
        },
        {
          sender: "alf",
          receiver: "manu",
          message: "¿En que te puedo ayudar?",
          date: "06:56",
        },
        {
          sender: "manu",
          receiver: "alf",
          message: "puess miraa ....",
          date: "06:56",
        },
      ],
      toSend: null,
      messageToSend: null,
      iteration: 0,
      user: null,
      receiver: "alf" /* poner dinamico este valor */,
    };
  },
  //   beforeRouteEnter: async function () {
  //     console.log("beforeeeeeeeeeeeeeeeeeeeeeeeeeeee")
  //     const token = sessionStorage.getItem("token");
  //     if (!token) this.$router.push("/login");
  //     console.log(`TOKEN : ${token}`);
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
  //     console.log(`result : ${result}`);
  //     if (!result.authenticated) {
  //       this.$router.push("/login")
  //     }
  //   },
  created: function () {
    console.log(this.user);
    this.user = JSON.parse(atob(sessionStorage.getItem("token").split(".")[1]));
    this.socket = io("http://localhost:7474");
  },
  mounted: function () {
    console.log(this.user);
    this.socket.on("message", (data) => {
      this.message = data;
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
