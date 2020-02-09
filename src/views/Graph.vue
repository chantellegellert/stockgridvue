<template>
<div>
  <div v-if="!userName || userName === ''">
  No no no need to log in first 
  </div>
  <div v-if="userName && userName !== ''">
      You did log in woohoo {{ userName }}
  </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
// import { getUserName } from "../store/stock";
import store from "@/store";
@Component({
  components: {}
})
export default class Welcome extends Vue {
  get userName() {
    return this.$store.state.userName;
  }

  constructor() {
    super();
  }
}
</script>

<style scoped lang="less"></style>
