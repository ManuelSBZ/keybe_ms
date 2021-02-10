<template>
  <div class="login">
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
