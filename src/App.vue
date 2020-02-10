<template>
  <div id="app">
    <!--  v-if="userName && userName !== ''" -->
    <div class="page-container md-layout-column">
      <md-toolbar class="md-primary" :md-elevation="1">
        <md-button class="md-icon-button" @click="showNavigation = true">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">{{ $route.name }}</span>

        <div class="md-toolbar-section-end">
          <md-button
            v-if="$route.name === 'Graph'"
            @click="showSidepanel = true"
            >Create New Graph</md-button
          >
        </div>
      </md-toolbar>

      <md-drawer :md-active.sync="showNavigation" md-swipeable>
        <md-toolbar class="md-transparent md-title-nav" md-elevation="0">
          <img class="mcap_logo center" src="./assets/mcap_trans.png" />
          <span class="md-title">Stock Graph</span>
        </md-toolbar>

        <md-list>
          <router-link to="/">
            <md-list-item @click="hideSidebar()">
              <md-icon>account_circle</md-icon>

              <div class="md-list-item-text">
                <span>Login page</span>
              </div>
            </md-list-item>
          </router-link>

          <router-link to="/graph">
            <md-list-item @click="hideSidebar()">
              <md-icon>assessment</md-icon>

              <div class="md-list-item-text">
                <span>Graph page</span>
              </div>
            </md-list-item>
          </router-link>
        </md-list>
      </md-drawer>

      <md-drawer
        class="md-right"
        :md-active.sync="showSidepanel"
        :class="showSidepanel ? '' : 'hide'"
      >
        <div class="viewport">
          <md-toolbar :md-elevation="1">
            <span class="md-title">Create New Grid</span>
          </md-toolbar>

          <md-list class="md-double-line">
            <md-subheader>Color</md-subheader>

            <md-list-item>
              <md-avatar class="md-avatar-icon md-darkblue"></md-avatar>

              <div class="md-list-item-text">
                <span>Dark Blue</span>
              </div>

              <md-radio v-model="newGraph.color" value="darkblue"></md-radio>
            </md-list-item>

            <md-list-item>
              <md-avatar class="md-avatar-icon md-grey"></md-avatar>

              <div class="md-list-item-text">
                <span>Grey</span>
              </div>

              <md-radio v-model="newGraph.color" value="grey"></md-radio>
            </md-list-item>

            <md-list-item>
              <md-avatar class="md-avatar-icon md-lightblue"></md-avatar>

              <div class="md-list-item-text">
                <span>Light Blue</span>
              </div>

              <md-radio v-model="newGraph.color" value="lightblue"></md-radio>
            </md-list-item>

            <md-divider></md-divider>
            <md-list-item>
              <md-field>
                <md-input
                  placeholder="Stock Name..."
                  name="stockName"
                  id="stockName"
                  v-model="newGraph.stockName"
                />
              </md-field>
            </md-list-item>

            <md-divider></md-divider>
            <md-subheader>Data Field</md-subheader>
            <div class="checkboxs">
              <md-checkbox v-model="newGraph.fields" value="open"
                >Open</md-checkbox
              >
              <md-checkbox v-model="newGraph.fields" value="high"
                >High</md-checkbox
              >
              <md-checkbox v-model="newGraph.fields" value="low"
                >Low</md-checkbox
              >
              <md-checkbox v-model="newGraph.fields" value="close"
                >Close</md-checkbox
              >
              <md-checkbox v-model="newGraph.fields" value="volume"
                >Volume</md-checkbox
              >
            </div>
          </md-list>

          <md-divider></md-divider>
          <md-button @click="submit()" class="md-primary">Create</md-button>
        </div>
      </md-drawer>
    </div>

    <transition name="slide">
      <router-view style="flex-grow : 1;"></router-view>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { cloneDeep } from "lodash";
import store from "@/store";

@Component({
  components: {}
})
export default class App extends Vue {
  showNavigation = false;
  showSidepanel = false;
  newGraph = {
    color: "",
    stockName: "",
    fields: []
  };

  get userName() {
    return this.$store.state.userName;
  }
  get graph() {
    return this.$store.state.newGraph;
  }
  constructor() {
    super();
  }

  created() {}

  mounted() {}

  hideSidebar() {
    this.showNavigation = false;
    this.showSidepanel = false;
  }

  submit() {
    var newGraph = cloneDeep(this.newGraph);
    this.$store.commit("addGraph", newGraph);
    this.newGraph = {
      color: "",
      stockName: "",
      fields: []
    };
  }
}
</script>

<!-- not scoped to give default across form -->
<style lang="less">
body {
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #717173;
  display: flex;
  flex-flow: column;
  height: 100%;
}

.hide {
  display: none;
}

.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}

.md-content {
  padding: 16px;
}
.md-drawer {
  padding: 20px;
  .md-title-nav {
    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      right: 15px;
      height: 1px;
      width: calc(100% - 30px);
      background-color: rgba(180, 180, 180, 0.3);
    }
  }

  .mcap_logo {
    height: 40px;
  }
}

.md-avatar.md-theme-default.md-avatar-icon.md-darkblue {
  background-color: #1d2675;
}

.md-avatar.md-theme-default.md-avatar-icon.md-lightblue {
  background-color: #8cd2f4;
}

.md-avatar.md-theme-default.md-avatar-icon.md-grey {
  background: linear-gradient(60deg, #919095, #717173);
}
</style>
