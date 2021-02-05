<template>
  <div class="login">
    <img alt="Vue logo" src="../assets/logo.png" />
    <LoginPanel msg="Login" />
  </div>
</template>

<script>
// @ is an alias to /src
import LoginPanel from "@/components/LoginPanel.vue";

export default {
  name: "Login",
  components: {
    LoginPanel
  }
};
</script>
