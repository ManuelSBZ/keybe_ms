<template>
  <div class="login">
    <img alt="Vue logo" src="../assets/logo.png" />
    <ChatTicket />
  </div>
</template>

<script>
// @ is an alias to /src
import ChatTicket from "@/components/ChatTicket.vue";

export default {
  name: "TicketInput",
  components: {
    ChatTicket
  },
    beforeRouteEnter:async function(to, from, next){
    const token = sessionStorage.getItem("token")
        const response = await fetch("http://localhost:7474/api/auth/validatetoken", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `${token}`
        }
      });
    const result = await response.json()
    next(async (vue) => {
      if (!token) {
        alert("You must login");
        vue.$router.push("/login");
      } else vue.$router.push(to.path);
      if (!result.authenticated) {
        alert("You must login");
        vue.$router.push("/login");
      } else vue.$router.push(to.path);
    })
  }
};
</script>
