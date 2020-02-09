import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

export interface IStockDay {
    day: string;
    open: number | null;
    high: number | null;
    low: number | null;
    close: number | null;
    volume: number | null;
}

export interface IStockData {
    metadata: {
        info: string;
        symbol: string;
        lastRefreshed: string;
        outputSize: string;
        timeZone: string;
    };
    series: IStockDay[];
}

const LOCALSTORAGE_KEY = "STOCK_DATA_";

function cacheRequest(
    key: string,
    request: AxiosRequestConfig,
    ignoreCache = false
) {
    let cacheKey = LOCALSTORAGE_KEY + key;
    let cachedData = localStorage.getItem(cacheKey);
    if (!ignoreCache && cachedData) {
        try {
            let parsed = JSON.parse(cachedData);
            return Promise.resolve(parsed);
        } catch {
            localStorage.removeItem(cacheKey);
        }
    }

    return axios(request).then(res => {
        localStorage.setItem(cacheKey, JSON.stringify(res.data));
        return res.data;
    });
}

const APIKEY = "6NQ84CAJ1T1RHQC4";

function getTimeSeriesDailyRequest(stockSymbol: string): AxiosRequestConfig {
    return {
        method: "get",
        url: `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${APIKEY}`
    };
}

export function getTimeSeriesDaily(stockSymbol: string): Promise<IStockData> {
    return cacheRequest(stockSymbol, getTimeSeriesDailyRequest(stockSymbol)).then(data => {
        return parseData(data);
    });
}

function tryParseFloat(num: string): number | null {
    try {
        return Number.parseFloat(num);
    } catch (err) {
        return null;
    }
}

// parse data from API into more javascript oriented format
function parseData(data): IStockData {
    let metadata = {
        info: data["Meta Data"]["1. Information"],
        symbol: data["Meta Data"]["2. Symbol"],
        lastRefreshed: data["Meta Data"]["3. Last Refreshed"],
        outputSize: data["Meta Data"]["4. Output Size"],
        timeZone: data["Meta Data"]["5. Time Zone"]
    };

    let seriesData = data["Time Series (Daily)"];
    let seriesKeys = Object.keys(seriesData);
    seriesKeys.sort(); // sort dates

    let series = seriesKeys.map(s => parseStockDay(seriesData[s], s));

    return { metadata, series };
}

function parseStockDay(item: any, day: string): IStockDay {
    return {
        day: day,
        open: tryParseFloat(item["1. open"]),
        high: tryParseFloat(item["2. high"]),
        low: tryParseFloat(item["3. low"]),
        close: tryParseFloat(item["4. close"]),
        volume: tryParseFloat(item["5. volume"])
    };
}
