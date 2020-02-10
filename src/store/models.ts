export default class GraphModel {
    color: string;
    stockName: string;
    fields: any[];
  
    constructor() {
      this.color = '';
      this.stockName = '';
      this.fields = [
        { checked: false, value: "open" },
        { checked: false, value: "close" },
        { checked: false, value: "high" },
        { checked: false, value: "low" },
        { checked: false, value: "volume" }
      ];
    }
  }