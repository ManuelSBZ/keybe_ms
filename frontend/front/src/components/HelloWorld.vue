<template>
  <div class="hello">
    <h1>chat {{ message }}</h1>
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-6 bg-danger">hello</div>
      </div>
    </div>
    <div class="input-group mb-3">
      <input
        v-model="message"
        class="form-control"
        placeholder="Recipient's username"
        aria-label="Recipient's username"
        aria-describedby="button-addon2"
      />
      <button
        @click="join"
        class="btn btn-outline-secondary"
        type="button"
        id="button-addon2"
      >
        Button
      </button>
      <br>
      <button
        @click="disconnect"
        class="btn btn-outline-secondary"
        type="button"
        id="button-addon2"
      >
        Button
      </button>
      
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
  name: "HelloWorld",
  methods:{
    join : function(){
      let user =JSON.parse(atob(sessionStorage.getItem("token").split(".")[1]))
      this.socket.emit("loggedin", {username:user.username})


        // this.socket.emit("private message", this.socket.id, "ping")
        // this.socket.on("private message",(data,d) =>{
        //   console.log("private message")
        //   console.log(data,d)
        // })
    }
    ,
    disconnect: function(){
      this.socket.disconnect()
      this.$router.push("/home")
    }
  },
  data: function () {
    return {
      socket: {},
      message: null,
      toSend: null,
      iteration: 0
    };
  },
  created: function () {
    this.socket = io("http://localhost:7474")
    // this.socket.on("message", data => {
    //   console.log("created")
    //   this.message = data
    // })
  },
  mounted: function () {
    console.log("Mounted!");
    this.socket.on("message", (data) => {
      console.log("created");
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
