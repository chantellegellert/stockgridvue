<template>
  <div>
    <router-link v-if="!userName || userName === ''" to="/">Home</router-link>
    <div class="content" v-if="userName && userName !== ''">
      <div class="md-layout">
        <!-- some kind of create chart -->
        <!-- for loop would go here for multiple charts on the div -->
        <div
          class="md-layout-item md-size-33 md-large-33 md-medium-size-50 md-xsmall-size-100"
        >
          <chart-card data-background-color="blue"></chart-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ChartCard from "../components/ChartCard.vue";
import store from "@/store";

@Component({
  components: {
    ChartCard
  }
})
export default class Graph extends Vue {
  get userName() {
    return this.$store.state.userName;
  }
  constructor() {
    super();
  }

  created() {}

  mounted() {}
}
</script>
