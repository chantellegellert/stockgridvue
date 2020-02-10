<template>
  <div class="home">
    <UserLogin />
  </div>
</template>

<script>
import UserLogin from "@/components/UserLogin.vue";
export default {
  name: "Home",
  components: {
    UserLogin
  }
};
</script>

<style scoped>
.home {
  background-image: url(../assets/peaceful.jpg);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
  background-size: 100% 100%;
}
</style>
