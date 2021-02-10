<template>
  <div class="login">
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
