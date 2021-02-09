// <template>
//   <div>
//     <div v-show="ticketValidated">
//       <h3>Chat Keybe</h3>
//       <div>
//         <div class="container-fluid bg-success rounded-lg">
//           <div class="row justify-content-center">
//             <div class="col d-flex justify-content-center">
//               <div class="container bg-light rounded-lg p-3">
//                 <div
//                   v-bind:class="
//                     'row justify-content-' +
//                     (msg.sender === user.username ? 'end' : 'left') +
//                     ' rounded-lg'
//                   "
//                   v-bind:key="msg.message.slice(0) + uuid() + 'index'"
//                   v-for="msg in message"
//                 >
//                   <div
//                     class="col-6 shadow-lg bg-info text-white rounded-lg p-3 m-3"
//                   >
//                     <div id="message">
//                       {{ msg.sender !== "manu" ? msg.sender : msg.message }}:
//                       {{ msg.sender === "manu" ? msg.sender : msg.message }}
//                     </div>
//                     <div
//                       v-bind:class="
//                         'd-flex justify-content-' +
//                         (msg.sender === user.username ? 'end' : 'left')
//                       "
//                       id="date"
//                     >
//                       <strong>{{ msg.date }}</strong>
//                     </div>
//                     <div id="actions"></div>
//                   </div>
//                 </div>
//                 <div class="input-group mb-3">
//                   <input
//                     id="campox"
//                     v-model="messageToSendTicket"
//                     type="text"
//                     class="form-control"
//                     placeholder="Recipient's username"
//                     aria-label="Recipient's username"
//                     aria-describedby="button-addon2"
//                   />
//                   <div class="input-group-append">
//                     <button
//                       @click="sendMessage"
//                       class="btn btn-outline-secondary"
//                       type="button"
//                       id="button-addon2"
//                     >
//                       Send
//                     </button>
//                     <br />
//                     <button
//                       @click="disconnect"
//                       class="btn btn-outline-secondary"
//                       type="button"
//                       id="button-addon2"
//                     >
//                       disconnet
//                     </button>
//                     <button
//                       v-if="user.rol === '1'"
//                       @click="done"
//                       class="btn btn-outline-secondary"
//                       type="button"
//                       id="button-addon2"
//                     >
//                       done
//                     </button>
//                     <button
//                       v-if="user.rol === '1'"
//                       @click="ticketGeneration"
//                       class="btn btn-outline-secondary"
//                       type="button"
//                       id="button-addon2"
//                     >
//                       ticket
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>

//     <div>
//       <div class="container p-4">
//         <div class="row justify-content-center">
//           <div class="col-6">
//             <div class="input-group mb-3">
//               <input
//                 v-model="ticket"
//                 type="text"
//                 class="form-control"
//                 placeholder="Recipient's username"
//                 aria-label="Recipient's username"
//                 aria-describedby="button-addon2"
//               />
//               <div class="input-group-append">
//                 <button
//                   @click="validateTicket"
//                   class="btn btn-outline-secondary"
//                   type="button"
//                   id="button-addon2"
//                 >
//                   Send
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </template>

// <script>
// import io from "socket.io-client";
// import uuid from "../utils/uuid";

// export default {
//   name: "ChatTicket",
//   data: function () {
//     return {
//       socket: {},
//       message: [],
//       messageToSendTicket: "",
//       user: null,
//       ticketValidated: false,
//       ticket: null,
//       toggle: false,
//     };
//   },
//   methods: {
//     uuid: uuid,
//     validateTicket: async function () {
//       let response = await fetch(
//         "http://localhost:7474/api/auth/validate/ticket",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "x-access-token": sessionStorage.getItem("token"),
//           },
//           body: JSON.stringify({
//             ticket: this.ticket,
//           }),
//         }
//       );
//       let ticket = await response.json();
//       if (ticket.validated) {
//         this.ticketValidated = true;
//         this.toggle = !this.toggle
//       } else {
//         alert("invalid ticket");
//         this.ticketValidated = false;
//         this.$router.push("/ticket/chat");
//       }
//     },
//     sendMessage:  function () {
//      var valor= document.getElementById("campox").value;

//     console.log("sending messag"+valor)
//     // let message = this.messageToSend
//       this.socket.emit("send-message",{
//         message: valor
//       });
//     },
//     disconnect: function () {
//       this.socket.disconnect();
//       this.$router.push("/login");
//     },
//     done: function () {
//       this.socket.emit("done-consultant", true);
//       this.message = [];
//     },
//     ticketGeneration: function () {
//       console.log("enviando algo");
//       this.socket.emit("generate-ticket", true);
//     },
//   },
//   watch: {
//     "toggle": function () {
//       console.log("tikect validated")
//       if (this.ticketValidated) {
//         if (sessionStorage.getItem("token")) {
//           this.user = JSON.parse(
//             atob(sessionStorage.getItem("token").split(".")[1])
//           );
//         } else this.$router.push("/login");
//         this.socket = io("http://localhost:7474");
//         this.socket.emit("match-chat-ticket", this.user,this.ticket);

//       }
//     },
//     $route(){
//       console.log("usuario desconectado por cambiar de vista")
//       this.socket.disconnect()
//     }
//   },
//   beforeCreate: function(){
//     if (this.socket){
//       console.log("SOCKET")
//       this.socket.disconnect()
//     }
//   },
//   created: function () {
//     if (sessionStorage.getItem("token")) {
//       this.user = JSON.parse(
//         atob(sessionStorage.getItem("token").split(".")[1])
//       );
//     } else this.$router.push("/login");
//     // this.socket = io("http://localhost:7474");
//     // this.socket.emit("match-chat-ticket", this.user,this.ticket);
//   },
//   mounted: function () {
//       console.log("MOUNNNNNNNNNNNNNNNNNNNNNNNNNNNNTED")
    
//   },
// };
// </script>

// <!-- Add "scoped" attribute to limit CSS to this component only -->
// <style scoped>
// h3 {
//   margin: 40px 0 0;
// }
// ul {
//   list-style-type: none;
//   padding: 0;
// }
// li {
//   display: inline-block;
//   margin: 0 10px;
// }
// a {
//   color: #42b983;
// }
// </style>
