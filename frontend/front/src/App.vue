<template>
  <div class="container-fluid" id="nav">
    <div class="row justify-content-center">
      <div class="col-1"><router-link to="/">Store</router-link> |</div>
      <div class="col-1"><router-link to="/about">About</router-link> |</div>
      <div v-if="this.user===null" class="col-1"><router-link to="/login">Login</router-link> |</div>
      <div v-if="this.user===null" class="col-1"><router-link to="/signup">Signup</router-link> |</div>
      <div v-if="this.user!==null" class="col-1"><router-link to="/chat">Chat</router-link> |</div>
      <div v-if="this.user!==null&&this.user.rol!=='1'" class="col-1"><router-link to="/ticket/chat">Ticket</router-link> |</div>
      <div v-if="this.user!==null" class="col-1"><router-link @click="logout" to="#">Logout</router-link> |</div>
      <div class="col-3 d-flex justify-content-left" v-if="this.user !== null">Usuario: {{ this.user.username }}:{{ this.user.rol === "1" ? "Consultant" : "Basic" }}</div>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return {
      user: null,
      token: sessionStorage.getItem("token")
    };
  },
  methods: {
    logout: function () {
      sessionStorage.setItem("token", "");
      this.user = null
      this.$router.push("/login")
    },
  },
  mounted: function () {
    if (this.token && this.token !== "")this.user = JSON.parse(atob(this.token.split(".")[1]))
  },
  watch:{
    user:function(){
      
    }
  }
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
