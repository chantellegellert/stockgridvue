<template>
  <div class="centered-container">
    <md-content class="md-elevation-3">
      <div class="logo_container">
        <img class="mcap_logo center" src="../assets/mcap_trans.png" />
      </div>

      <div class="title">
        <div class="md-title">Login</div>
      </div>

      <div class="form">
        <md-field>
          <label>User name</label>
          <md-input v-model="loginCred.username" autofocus></md-input>
        </md-field>

        <md-field md-has-password>
          <label>Password</label>
          <md-input v-model="loginCred.password" type="password"></md-input>
        </md-field>
      </div>

      <div class="failedlogin" v-if="loginfail">
        You failed to login try again
      </div>

      <md-card-actions>
        <md-button class="md-raised md-primary" @click="auth">Log in</md-button>
      </md-card-actions>

      <div class="loading-overlay" v-if="loading">
        <md-progress-spinner
          md-mode="indeterminate"
          :md-stroke="2"
        ></md-progress-spinner>
      </div>
    </md-content>
  </div>
</template>

<script>
import { Component, Prop, Emit, Vue } from "vue-property-decorator";
import { dataService } from "../services/dataService";
import store from "@/store";

@Component({
  components: {}
})
export default class Login extends Vue {
  loginCred = {
    username: "",
    password: ""
  };

  loginfail = false;
  loading = false;

  constructor() {
    super();
  }

  created() {}

  destroyed() {}

  clearForm() {
    this.loginCred = {};
    this.loginfail = false;
  }

  auth() {
    this.loading = true;

    dataService
      .checkLogin(this.loginCred.username, this.loginCred.password)
      .then(res => {
        this.loading = false;
        if (res) {
          this.clearForm();
          this.$store.commit("adduserName", this.loginCred.username);
          this.$router.push("/graph");
        } else {
          this.loginfail = true;
        }
      });
  }
}
</script>

<style lang="less" scoped>
.centered-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100vh;
  background-color: rgba(29, 38, 117, 0.2);
  .failedlogin {
    color: red;
  }
  .mcap_logo {
    height: 90px;
  }
  .logo_container {
    margin-top: -90px;
    z-index: 2;
    height: 90px;
  }
  .title {
    margin-top: 10px;
    text-align: center;
    color: #717173;
  }
  .actions {
    .md-button {
      margin: 0;
    }
  }
  .form {
    margin-bottom: 60px;
  }

  .md-content {
    z-index: 1;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    position: relative;
    border-radius: 6px;
  }
  .loading-overlay {
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
