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

    <div class="checkboxs">
      <md-checkbox
        id="toggle-all"
        class="toggle-all"
        v-model="allSelect"
        @change="selectAll()"
      >
        All
      </md-checkbox>

      <md-checkbox
        v-for="item in items"
        v-bind:key="item.id"
        v-model="item.checked"
        @change="checkAll()"
      >
        {{ item.value }}
      </md-checkbox>

      <!-- <md-checkbox v-model="field" value="all">All</md-checkbox>
      <md-checkbox v-model="field" value="open">Open</md-checkbox>
      <md-checkbox v-model="field" value="high">High</md-checkbox>
      <md-checkbox v-model="field" value="low">Low</md-checkbox>
      <md-checkbox v-model="field" value="close">Close</md-checkbox>
      <md-checkbox v-model="field" value="volume">Volume</md-checkbox> -->
    </div>

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
import store from "@/store";
import StockChart from "../components/StockChart.vue";

export interface IDataField {
  checked: boolean;
  value: string;
}

export function filterActiveItems(items) {
  return items.filter(item => !item.checked);
}

export function filterSelectedItems(items: IDataField[]) {
  let filtered: IDataField[] = items.filter(item => item.checked);
  let result: string[] = [];
  for (let filter of filtered) {
    result.push(filter.value);
  }
  return result;
}

@Component({
  components: {
    StockChart
  },
  directives: {
    "symbol-focus": function(el, binding) {
      if (binding.value) {
        el.focus();
      }
    }
  }
})
export default class ChartCard extends Vue {
  @Prop() index: number;

  allSelect: boolean = false;
  dataBackgroundColor: string = "";
  data: IStockData | null = null;
  options: any = null;
  items: IDataField[] = [];
  stockSymbol = "MSFT";
  editedSymbol: string | null = "";
  isEditing: boolean = false;
  beforeEditCache: string = "";

  get graphs() {
    return this.$store.state.graphs;
  }

  get field() {
    return filterSelectedItems(this.items);
  }

  get remaining() {
    return filterActiveItems(this.items).length;
  }

  constructor() {
    super();
  }

  created() {
    console.log("Created Chard Card for: ", this.index, this.stockSymbol);
    this.items = this.graphs[this.index].fields;
    this.stockSymbol = this.graphs[this.index].stockName;
    this.dataBackgroundColor = this.graphs[this.index].color;
    this.refreshData();
  }

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
    console.log(
      "Finished editing new symbol: ",
      this.editedSymbol,
      " old symbol: ",
      this.beforeEditCache
    );
    this.stockSymbol = this.editedSymbol ? this.editedSymbol : "";
    this.isEditing = false;
    this.refreshData();
  }

  cancelEdit() {
    console.log("User canceled editing");
    this.stockSymbol = this.beforeEditCache;
    this.editedSymbol = null;
    this.isEditing = false;
  }

  async refreshData() {
    console.log("Refreshing data");
    this.data = await getTimeSeriesDaily(this.stockSymbol);
  }

  selectAll() {
    for (let t of this.items) {
      t.checked = this.allSelect;
    }
  }

  checkAll() {
    this.allSelect = this.remaining === 0;
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
.md-card [data-background-color="darkblue"] {
  background: linear-gradient(60deg, #1d2675, #171e5e);
  -webkit-box-shadow: 0 12px 20px -10px rgba(11, 15, 46, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(9, 12, 37, 0.2);
  box-shadow: 0 12px 20px -10px rgba(11, 15, 46, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(9, 12, 37, 0.2);
}

.md-card [data-background-color="grey"] {
  background: linear-gradient(60deg, #919095, #717173);
  -webkit-box-shadow: 0 12px 20px -10px rgba(57, 56, 58, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(57, 56, 58, 0.28);
  box-shadow: 0 12px 20px -10px rgba(57, 56, 58, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(57, 56, 58, 0.2);
}

.md-card [data-background-color="lightblue"] {
  background: linear-gradient(60deg, #8cd2f4, #46b7ed);
  -webkit-box-shadow: 0 12px 20px -10px rgba(55, 82, 96, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(27, 72, 93, 0.2);
  box-shadow: 0 12px 20px -10px rgba(55, 82, 96, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(27, 72, 93, 0.2);
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

// box do overlay
.md-card {
  display: inline-block;
  position: relative;
  width: 100%;
  margin: 25px 0;
  overflow: unset;

  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);

  .checkboxs {
    padding: 0px 10px;
  }

  .card-height-indicator {
    margin-top: 100%;
  }

  &.row-space {
    .header {
      padding: 15px 20px 0;
    }
  }

  .md-card-content {
    padding: 15px 20px;
  }

  .md-card-header {
    &.card-chart {
      padding: 0;
      min-height: 160px;

      + .content {
        h4 {
          margin-top: 0;
        }
      }
    }
  }
}
</style>
