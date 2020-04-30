import React, { useEffect, useState, useMemo } from "react";
import * as d3 from 'd3';
import Plot from 'react-plotly.js';
import moment from "moment";
import SYMBOLS_raw from "./symbols.json";
import symbolsBySector from "./symbolsBySector.json";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const SYMBOLS = SYMBOLS_raw.filter(sym => !sym.includes("."))

function App() {
    const [symbol, setSymbol] = useState('MSFT');
    const [reportBySymbol, setReportBySymbol] = useState({});
    const [priceBySymbol, setPriceBySymbol] = useState({});

    useEffect(() => {
        if (typeof reportBySymbol[symbol] === 'undefined') {
            fetch(`reports/${symbol}.csv`)
            .then(res => res.text())
            .then(csvString => {
                let data = d3.csvParse(csvString, d3.autoType);
                setReportBySymbol(prevState => ({ ...prevState, [symbol]: data }));
            });
        }
        if (typeof priceBySymbol[symbol] === 'undefined') {
            fetch(`prices/${symbol}.csv`)
            .then(res => res.text())
            .then(csvString => {
                let data = d3.csvParse(csvString, d3.autoType);
                setPriceBySymbol(prevState => ({ ...prevState, [symbol]: data }));
            });
        }
    }, [symbol, reportBySymbol, priceBySymbol]);

    const sector = useMemo(() => {
        let result;
        Object.keys(symbolsBySector).some(sec => {
            if (symbolsBySector[sec].includes(symbol)) {
                result = sec;
                return true;
            }
            return false;
        })
        return result;
    }, [symbol]);

    const report = reportBySymbol[symbol];
    const price = priceBySymbol[symbol] || [];
    console.log(price);

    return <div className="container mt-3">
        <Autocomplete
            className="mb-3"
            options={SYMBOLS}
            renderInput={(params) => <TextField {...params} label="Symbol" variant="outlined" />}
            value={symbol}
            onChange={(_, val) => setSymbol(val)}
        />
        <h3><span className="badge badge-secondary">{sector}</span></h3>
        {report ? <>
            <Plot
                data={[
                    {
                        x: price.map(dat => dat['Adj Close']),
                        type: 'histogram'
                    }
                ]}
                useResizeHandler
                style={{ width: '100%', height: '100%' }}
                layout={{ autosize: true, legend: { "orientation": "h" },
                    title: 'Price Distribution' }}
            />
            <RatioPlot
                report={report}
                title="Profit Margin"
                key1="annualNetIncome"
                name1="Net Income"
                key2="annualTotalRevenue"
                name2="Total Revenue"
            />
            <Plot
                data={[
                    {
                        x: report.map(dat => moment(dat['date']).year()),
                        y: report.map(dat => dat['annualStockholdersEquity']),
                        type: 'bar',
                        name: 'annualStockholdersEquity',
                    },
                    {
                        x: report.map(dat => moment(dat['date']).year()),
                        y: report.map(dat => dat['annualTotalLiabilitiesNetMinorityInterest']),
                        type: 'bar',
                        name: 'annualTotalLiabilitiesNetMinorityInterest',
                    },
                    {
                        x: report.map(dat => moment(dat['date']).year()),
                        y: report.map(dat => dat['annualTotalAssets']),
                        type: 'bar',
                        name: 'annualTotalAssets',
                    },
                ]}
                useResizeHandler
                style={{ width: '100%', height: '100%' }}
                layout={{ autosize: true, legend: { "orientation": "h" }, title: 'Asset, Liability & Equity' }}
            />
            <RatioPlot
                report={report}
                title="Return On Assets"
                key1="annualNetIncome"
                name1="Net Income"
                key2="annualTotalAssets"
                name2="Total Assets"
            />
            <RatioPlot
                report={report}
                title="Current Ratio"
                key1="annualCurrentAssets"
                name1="Current Assets"
                key2="annualCurrentLiabilities"
                name2="Current Liabilities"
                factor={1}
                y2range={[0, 5]}
            />
            <RatioPlot
                report={report}
                title="Payout Ratio"
                key1="annualCashDividendsPaid"
                name1="Cash Dividends Paid"
                key2="annualNetIncome"
                name2="Net Income"
                key1factor={-1}
            />
            <Plot
                data={[{
                    x: report.map(dat => moment(dat['date']).year()),
                    y: report.map(dat => dat['annualFreeCashFlow']),
                }]}
                useResizeHandler
                style={{ width: '100%', height: '100%' }}
                layout={{ autosize: true, title: 'Free Cash Flow' }}
            />
        </> : <p>Loading...</p>}
    </div>
}

export default App;

function RatioPlot({
    report,
    title,
    key1, name1,
    key2, name2,
    factor = 100,
    key1factor = 1,
    y2range = [0, 100]
}) {
    const dates = report.map(dat => moment(dat['date']).year());

    return <Plot
        data={[
            {
                x: dates,
                y: report.map(dat => key1factor * dat[key1]),
                name: name1,
                type: 'bar',
            },
            {
                x: dates,
                y: report.map(dat => dat[key2]),
                name: name2,
                type: 'bar',
            },
            {
                x: dates,
                y: report.map(dat => factor * key1factor * dat[key1] / dat[key2]),
                name: title,
                yaxis: 'y2',
            }
        ]}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
        layout={{
            autosize: true,
            title,
            yaxis2: { overlaying: 'y', side: 'right', range: y2range },
            legend: { "orientation": "h" }
        }}
    />
}
