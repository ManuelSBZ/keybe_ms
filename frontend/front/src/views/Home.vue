<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome To Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  created:async function(){
    const token = sessionStorage.getItem("token")
    if(!token) this.$router.push("/login")
    console.log(`TOKEN : ${token}`)
    const response = await fetch("http://localhost:7474/api/auth/validatetoken", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `${token}`
        }
      });
    const result = await response.json()
    console.log(`result : ${result}`)
    if(!result.authenticated){
      this.$router.push("/login")
    }
  }
};
</script>
