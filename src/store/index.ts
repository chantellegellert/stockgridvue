import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userName: ""
  },

  mutations: {
    adduserName(state, name: string) {
      state.userName = name;
    }
  },
  actions: {
    adduserName(context, name: string) {
      return new Promise((resolve, reject) => {
        context.commit("adduserName", name);
        resolve();
      });
    }
  }
});
