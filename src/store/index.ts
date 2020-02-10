import Vue from "vue";
import Vuex from "vuex";
import GraphModel from './models';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userName: "",
    graphs: Array<GraphModel>()
  },

  mutations: {
    adduserName(state, name: string) {
      state.userName = name;
    },
    addGraph(state, newGraph: GraphModel) {
      state.graphs.push(newGraph);
    },
    deleteGraphs(state){
      state.graphs = [];
    }
  },
  actions: {
    adduserName(context, name: string) {
        context.commit("adduserName", name);
    },
    addGraph(context, newGraph: GraphModel) {
      context.commit('addGraph', newGraph);
    },
    deleteGraphs(context) {
      context.commit('deleteGraphs');
    }
  }
});
