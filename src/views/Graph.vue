<template>
  <div>
    <!-- <div class="content" v-if="userName && userName !== ''"> -->
    <div>
      <div class="md-layout">
        <div
          v-for="graph in graphs"
          v-bind:key="graph.id"
          class="md-layout-item md-size-33 md-large-33 md-medium-size-50 md-xsmall-size-100"
        >
          <chart-card :data-background-color="graph.color"></chart-card>
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

  get graphs() {
    return this.$store.state.graphs;
  }
  constructor() {
    super();
  }

  created() {}

  mounted() {}
}
</script>

<style lang="less" scoped>
.md-layout {
  margin: 20px;
}
.md-layout-item {
  padding: 16px;
}
</style>
