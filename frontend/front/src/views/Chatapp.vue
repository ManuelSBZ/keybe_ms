<template>
  <div class="home">
    <Chat />
  </div>
</template>

<script>
// @ is an alias to /src
import Chat from "@/components/Chat.vue";
export default {
  name: "Chatapp",
  components: {
    Chat
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
      if (!token || token ==="") {
        alert("You must login");
        vue.$router.push("/login");
      } else vue.$router.push(to.path);
      if (!result.authenticated) {
        alert("You must login");
        vue.$router.push("/login");
      } else vue.$router.push(to.path);
    })
       console.log("finnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn")

  }
};
</script>
