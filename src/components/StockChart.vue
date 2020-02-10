<template>
  <canvas ref="chart" width="40" height="40"> </canvas>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Chart } from "chart.js";
import { IStockData } from "../services/alphavantageAPI";

@Component
export default class StockChart extends Vue {
  @Prop() data: IStockData;
  @Prop() options: any;
  @Prop() field: string[];
  myChart: Chart;

  constructor() {
    super();
  }

  created() {
    console.log("Rendering graph page");
  }

  mounted() {
    let canvasElement = this.$refs["chart"] as any;
    Chart.defaults.global.defaultFontColor = 'white';
    this.myChart = new Chart(canvasElement, {
      type: "line",
      data: {},
      options: {
        scales: {
          xAxes: [{ gridLines: { color: "#ffffff" } }],
          yAxes: [
            {
              gridLines: { color: "#ffffff" },
              ticks: {
                //beginAtZero: true
              }
            }
          ]
        }
      }
    });

    this.onDataChange();
  }

  @Watch("field", { immediate: true })
  @Watch("data", { immediate: true })
  onDataChange() {
    if (this.myChart && this.data) {
      let chartData = this.parseStockData(this.data, this.field
      // [
      //   "open",
      //   "high",
        // "low",
        // "close"
        // // "volume"
      // ]
      );
      this.myChart.data = chartData;
      this.myChart.update();
    }
  }

  // parses IStockData into 1 or more datasets for chart
  parseStockData(data: IStockData, selectedFields: string[]) {
    // create dataset lookup
    let datasetObj: { [key: string]: any } = selectedFields
      .map(f => ({
        label: f,
        data: [],
        lineTension: 0,
        fill: false,
        borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)}, 1)`
      }))
      .reduce((a, b) => ({ ...a, [b.label]: b }), {});

    for (let s of data.series)
      for (let key in datasetObj) datasetObj[key].data.push(s[key]);

    return {
      labels: data.series.map(s => s.day),
      datasets: Object.values(datasetObj)
    };
  }
}
</script>
