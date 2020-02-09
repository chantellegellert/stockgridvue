<template>
  <md-card>
    <md-card-header
      class="card-chart"
      :data-background-color="dataBackgroundColor"
    >
      <StockChart v-if="data" :field="field" :data="data" :options="options" />
    </md-card-header>

    <md-card-content>
      <ul class="stock-list">
        <li class="stock" :class="{ editing: isEditing }">
          <div class="view">
            <label @dblclick="editSymbol()">{{ stockSymbol }}</label>
          </div>
          <input
            class="edit"
            type="text"
            v-model="editedSymbol"
            @blur="doneEdit()"
            @keyup.enter="doneEdit()"
            @keyup.esc="cancelEdit()"
          />
        </li>
      </ul>
    </md-card-content>

    <md-card-content>
      <div class="stats">
        <div>
          Data Field
          <select v-model="field">
            <option disabled value="">Please select one</option>
            <option>open</option>
            <option>high</option>
            <option>low</option>
            <option>close</option>
            <option>volume</option>
          </select>
        </div>
      </div>
    </md-card-content>

    <md-card-actions md-alignment="right">
      <div class="stats">
        <md-button @click="refreshData()" type="submit" class="md-primary"
          >Update</md-button
        >
      </div>
    </md-card-actions>
  </md-card>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from "vue-property-decorator";
import { getTimeSeriesDaily, IStockData } from "../services/alphavantageAPI";
import StockChart from "../components/StockChart.vue";
import { cloneDeep } from "lodash";

@Component({
  components: {
    StockChart
  },
  directives: {
    "symbol-focus": function(el, binding) {
      // only focus on item double clicked
      if (binding.value) {
        el.focus();
      }
    }
  }
})
export default class ChartCard extends Vue {
  @Prop() dataBackgroundColor: string;

  data: IStockData | null = null;
  options: any = null;
  field: string = "open";
  stockSymbol = "MSFT";
  editedSymbol: string | null = "";
  isEditing: boolean = false;
  beforeEditCache: string = "";

  constructor() {
    super();
  }

  created() {}

  destroyed() {}

  editSymbol() {
    this.isEditing = true;
    this.beforeEditCache = this.stockSymbol;
    this.editedSymbol = this.stockSymbol;
  }

  doneEdit() {
    if (!this.editedSymbol) {
      return;
    }
    this.stockSymbol = this.editedSymbol ? this.editedSymbol : "";
    this.isEditing = false;
  }

  cancelEdit() {
    this.stockSymbol = this.beforeEditCache;
    this.editedSymbol = null;
    this.isEditing = false;
  }

  async refreshData() {
    this.data = await getTimeSeriesDaily(this.stockSymbol);
  }
}
</script>

<!-- for the double click edit -->
<style scoped>
.stock-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.stock-list li {
  position: relative;
  font-size: 24px;
}

.stock-list li.editing {
  border-bottom: none;
  padding: 0;
}

.stock-list li.editing .edit {
  display: block;
  width: calc(100% - 43px);
  padding: 12px 16px;
  margin: 0 0 0 43px;
}

.stock-list li.editing .view {
  display: none;
}

.stock-list li label {
  word-break: break-all;
  display: block;
  line-height: 1.2;
  transition: color 0.4s;
}

.stock-list li .edit {
  display: none;
}
</style>

<style lang="less" scoped>
.md-card [data-background-color="blue"] {
  background: linear-gradient(60deg, #26c6da, #00acc1);
  -webkit-box-shadow: 0 12px 20px -10px rgba(0, 188, 212, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(0, 188, 212, 0.2);
  box-shadow: 0 12px 20px -10px rgba(0, 188, 212, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(0, 188, 212, 0.2);
}

.md-card [data-background-color="red"] {
  background: linear-gradient(60deg, #ef5350, #e53935);
  -webkit-box-shadow: 0 12px 20px -10px rgba(244, 67, 54, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2);
  box-shadow: 0 12px 20px -10px rgba(244, 67, 54, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2);
}

.md-card [data-background-color="green"] {
  background: linear-gradient(60deg, #66bb6a, #43a047);
  -webkit-box-shadow: 0 12px 20px -10px rgba(76, 175, 80, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(76, 175, 80, 0.2);
  box-shadow: 0 12px 20px -10px rgba(76, 175, 80, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(76, 175, 80, 0.2);
}

.md-card-header {
  &.card {
    padding: 0;
    min-height: 160px;
  }
}
.md-card [data-background-color] {
  color: #ffffff;
}
.md-card .md-card-header {
  -webkit-box-shadow: 0 10px 30px -12px rgba(0, 0, 0, 0.42),
    0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
  box-shadow: 0 10px 30px -12px rgba(0, 0, 0, 0.42),
    0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
  margin: -20px 15px 0;
  border-radius: 3px;
  padding: 15px;
  background-color: #999999;
}
.md-card .md-card-content {
  padding: 15px 20px;
}

// actions
.md-card .md-card-actions {
  margin: 0 20px 10px;
  padding: 10px 0 0 0;
  border-top: 1px solid #eeeeee;
}
.md-card-actions.md-alignment-left {
  justify-content: flex-start;
}
.md-card-actions {
  padding: 8px;
  display: flex;
  align-items: center;
}

// stats
.md-card .md-card-actions .stats {
  line-height: 22px;
  color: #999999;
  font-size: 12px;
}

.md-card .md-card-actions div {
  display: inline-block;
}
</style>
