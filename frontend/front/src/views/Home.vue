<template>
  <div class="home">
    <HelloWorld />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld,
  },
  // data() {
  //   return {
  //     authenticated: false,
  //   };
  // },

  // created: function(){
  // }
  // beforeRouteEnter: async function(){
  //   const token = sessionStorage.getItem("token")
  //   console.log(this)
  //   if(!token) this.$router.push("/login")

  //   console.log(`TOKEN : ${token}`)
  //   const response = await fetch("http://localhost:7474/api/auth/validatetoken", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "x-access-token": `${token}`
  //       }
  //     });
  //   const result = await response.json()
  //   console.log(`result : ${result}`)
  //   if(!result.authenticated){
  //     this.$router.push("/login")
  //   }
  // }
  // ,

  // beforeRouteEnter: async function (to, from, next) {
  //   const token = sessionStorage.getItem("token");
  //   const response = await fetch(
  //     "http://localhost:7474/api/auth/validatetoken",
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "x-access-token": `${token}`,
  //       },
  //     }
  //   );
  //   const result = await response.json();
  //   next(async (vue) => {
  //     if (!token) {
  //       alert("You must login");
  //       vue.$router.push("/login");
  //     } else vue.$router.push(to.path);
  //     if (!result.authenticated) {
  //       alert("You must login");
  //       vue.$router.push("/login");
  //     } else {
  //       vue.$router.push(to.path)
  //       };
  //   });
  // },
};
</script>
