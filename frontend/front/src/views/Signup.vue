<template>
  <div class="login">
    <img alt="Vue logo" src="../assets/logo.png" />
    <SignupPanel msg="SignUp" />
  </div>
</template>

<script>
// @ is an alias to /src
import SignupPanel from "@/components/SignupPanel.vue";

export default {
  name: "Signup",
  components: {
    SignupPanel
  }
};
</script>
