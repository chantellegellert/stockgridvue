<template>
  <div class="centered-container">
    <md-content class="md-elevation-3">
      <div class="logo_container">
        <img class="mcap_logo center" src="../assets/mcap_trans.png" />
      </div>

      <form novalidate class="md-layout" @submit.prevent="validateUser">
        <md-card
          class="md-card-login md-layout-item md-size-100 md-small-size-100"
        >
          <md-card-header>
            <div class="md-title">Login Page</div>
          </md-card-header>

          <md-card-content
            v-if="$store.state.userName && $store.state.userName !== ''"
          >
            You are logged in as {{ $store.state.userName }}
          </md-card-content>

          <md-card-content
            v-if="!$store.state.userName || $store.state.userName === ''"
          >
            <md-field :class="getValidationClass('userName')">
              <label for="user-name">User Name</label>
              <md-input
                name="user-name"
                id="user-name"
                autocomplete="users-name"
                v-model="form.userName"
                :disabled="loading"
              />
              <span class="md-error" v-if="!$v.form.userName.required"
                >The user name is required</span
              >
              <span class="md-error" v-else-if="!$v.form.userName.minlength"
                >Invalid user name</span
              >
            </md-field>

            <md-field md-has-password :class="getValidationClass('password')">
              <label for="password">Password</label>
              <md-input
                name="password"
                id="password"
                type="password"
                v-model="form.password"
                :disabled="loading"
              />
              <span class="md-error" v-if="!$v.form.password.required"
                >The password is required</span
              >
              <span class="md-error" v-else-if="!$v.form.password.minlength"
                >Invalid password</span
              >
            </md-field>
          </md-card-content>
          <div class="failedlogin" v-if="loginfail">
            You failed to login try again
          </div>
          <md-card-actions>
            <md-button
              v-if="!$store.state.userName || $store.state.userName === ''"
              type="submit"
              class="md-primary"
              :disabled="loading"
              >Login</md-button
            >
            <div
              class="md-layout md-gutter"
              v-if="$store.state.userName && $store.state.userName !== ''"
            >
              <div class="md-layout-item md-small-size-100">
                <md-button
                  @click="logout()"
                  class="md-primary"
                  :disabled="loading"
                  >Logout</md-button
                >
              </div>
              <div class="md-layout-item md-small-size-100">
                <md-button
                  @click="nextPage()"
                  class="md-primary"
                  :disabled="loading"
                  >Continue</md-button
                >
              </div>
            </div>
          </md-card-actions>
        </md-card>
      </form>
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
import { validationMixin } from "vuelidate";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";

import { dataService } from "../services/dataService";

import store from "@/store";

export default {
  name: "FormValidation",
  mixins: [validationMixin],
  data: () => ({
    form: {
      userName: null,
      password: null
    },
    loginfail: false,
    loading: false
  }),
  validations: {
    form: {
      userName: {
        required,
        minLength: minLength(3)
      },
      password: {
        required,
        minLength: minLength(3)
      }
    }
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.form.userName = null;
      this.form.password = null;
    },
    checkLoginInfo() {
      this.loading = true;

      dataService
        .checkLogin(this.form.userName, this.form.password)
        .then(res => {
          this.loading = false;
          if (res) {
            this.$store.commit("adduserName", this.form.userName);
            this.clearForm();
            this.$router.push("/graph");
          } else {
            this.loginfail = true;
          }
        });
    },
    logout() {
      this.form.password = "";
      this.$store.state.userName = "";
    },
    nextPage() {
      this.$router.push("/graph");
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.checkLoginInfo();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.centered-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100%;
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

  .md-card-login {
    box-shadow: none !important;
  }

  .md-card .md-title {
    margin-top: 10px;
    text-align: center;
    color: #717173;
  }
  .md-content {
    z-index: 1;
    padding: 40px 40px 10px 40px;
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
