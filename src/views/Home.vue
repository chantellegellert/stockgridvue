<template>
  <div class="home">
    <UserLogin />
    <!-- <Login /> -->
  </div>
</template>

<script>
import UserLogin from "@/components/UserLogin.vue";
// import Login from "@/components/Login.vue";
export default {
  name: "Home",
  components: {
    UserLogin
    // Login
  }
};
</script>

<style scoped>
.home {
  background-image: url(../assets/peaceful.jpg);
  background-repeat: no-repeat;
  height: 100vh;
  width: 100%;
  background-size: 100% 100%;
}
</style>
