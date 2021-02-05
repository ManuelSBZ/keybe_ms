<template>
  <div>
    <div class="container-fluid justify-content-center">
      <div class="row justify-content-center">
        <div class="col-8">
          <h1>{{ msg }}</h1>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-5">
        <form>
          <div class="form-group">
            <label for="exampleUsername1">Username</label>
            <input
              v-model="form.username"
              type="text"
              class="form-control"
              id="inputUsername1"
              aria-describedby="usernameHelp"
            />
            <small id="usernameHelp" class="form-text text-muted"
              >Username must be unique.</small
            >
          </div>
          <!-- <div class="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input
              type="email"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
            <small id="emailHelp" class="form-text text-muted"
              >We'll never share your email with anyone else.</small
            >
          </div> -->
          <div class="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input
              v-model="form.password"
              type="password"
              class="form-control"
              id="exampleInputPassword1"
            />
          </div>
          <div class="form-group form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="exampleCheck1"
            />
            <label class="form-check-label" for="exampleCheck1"
              >Check me out</label
            >
          </div>
          <button @click="slogin" type="submit" class="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPanel",
  props: {
    msg: String,
  },
  data: function () {
    return {
      form: {
        username: null,
        password: null,
      },
    }
  },
    methods: {
    slogin: async function(e){
      e.preventDefault();

      console.log(this.form.username, this.form.password);
      const response = await fetch("http://localhost:7474/api/auth/getToken", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic" +
            " " +
            window.btoa(`${this.form.username}:${this.form.password}`),
        },
      });
      const result = await response.json()

      if(result.authenticated){
        sessionStorage.setItem("token",result.token)
        this.$router.push("/")
      }
      console.log(result.authenticated,result.token)
    }
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
