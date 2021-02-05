<template>
  <form>
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
            <small
              v-if="helper.username != null"
              id="usernameHelp"
              class="form-text text-muted"
              >{{ helper.username }}.</small
            >
          </div>
          <div class="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input
              @blur="validateEmail"
              v-model="form.email"
              type="email"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
            <small id="emailHelp" class="form-text text-muted">{{
              helper.email
            }}</small>
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input
              v-model="form.password"
              type="password"
              class="form-control"
              id="exampleInputPassword1"
            />
            <small id="emailHelp" class="form-text text-muted"
              >{{ helper.password }}.</small
            >
          </div>
          <div class="container pb-4">
            <div class="row">
              <div class="col">
                <select v-model="form.rol" class="custom-select">
                  <option selected value="0">basic</option>
                  <option value="1">consultant</option>
                </select>
              </div>
              <div class="row">
                <small id="emailHelp" class="form-text text-muted"
                  >{{ helper.rol }}.</small
                >
              </div>
            </div>
          </div>
          <button @click="slogin" type="submit" class="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: "LoginPanel",
  props: {
    msg: String,
  },
  data: function () {
    return {
      helper: {
        username: null,
        password: null,
        email: null,
      },
      form: {
        username: null,
        email: null,
        password: null,
        rol: null,
      },
    };
  },
  methods: {
    slogin: async function (e) {
      e.preventDefault();
      console.log(this.form.rol,this.form.rol,this.form.rol,this.form.rol)
      const response = await fetch("http://localhost:7474/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
          rol: this.form.rol,
        }),
      });
      const result = await response.json();
      
      if (result.created) {
        this.$router.push("/login");
      } else {
        let fields = ["username", "email", "password", "rol"];
        const tag = result.message.split(" ")[0];
        this.helper[tag] = result.message;
        fields.forEach((item) => {
          if (item !== tag) {
            this.helper[item] = null;
          }
        });
      }
    },
  //   validateEmail() {
  //     if (/^\w+([-]?\w+)*@\w+([-]?\w+)*(\w{2,3})+$/.test(this.form.email)) {
  //       this.helper.email = "Please enter a valid email address";
  //     } else {
  //       this.helper.email = null;
  //     }
  //   },
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
