import React, { Component, useEffect, useState } from "react";
import Chart from 'react-apexcharts'
import * as d3 from 'd3';
import lodash from 'lodash';
import { sparlineOptions } from "./constants";
import symbolBySectors from "./symbolsBySector.json";

const TECH_SYMBOLS = Array.from(new Set(symbolBySectors['technology']));

class OurChart extends Component {
    render() {
        const { options, series, type = 'bar', width = 500, height = 320 } = this.props;
        return (
            <Chart options={options} series={series} type={type} width={width} height={height} />
        )
    }
}

function StockRow({ symbol, data }) {
    if (data) {
        const profit_margin = data.map(dat => (dat['annualNetIncome'] / dat['annualTotalRevenue'] * 100).toFixed(0));
        const roe = data.map(dat => (dat['annualNetIncome'] / dat['annualStockholdersEquity'] * 100).toFixed(0));
        const currentRatio = data.map(dat => (dat['annualCurrentAssets'] / dat['annualCurrentLiabilities']).toFixed(1));
        const payoutRatio = data.map(dat => (-1 * dat['annualCashDividendsPaid'] / dat['annualNetIncome'] * 100).toFixed(0));
        const dilutedEPS = data.map(dat => (dat['annualDilutedEPS'] || 0).toFixed(1));

        return <tr>
            <th>{symbol}</th>
            <td><OurChart options={sparlineOptions} series={[{ data: profit_margin }]} height={'50px'} width={'100%'} /></td>
            <td><OurChart options={sparlineOptions} series={[{ data: roe }]} height={'50px'} width={'100%'} /></td>
            <td><OurChart options={sparlineOptions} series={[{ data: currentRatio }]} height={'50px'} width={'100%'} /></td>
            <td><OurChart options={sparlineOptions} series={[{ data: payoutRatio }]} height={'50px'} width={'100%'} /></td>
            <td><OurChart options={sparlineOptions} series={[{ data: dilutedEPS }]} height={'50px'} width={'100%'} /></td>
        </tr>
    } else {
        return <tr>
            <td>Loading..</td>
            <td>Loading..</td>
            <td>Loading..</td>
            <td>Loading..</td>
            <td>Loading..</td>
            <td>Loading..</td>
        </tr>
    }

}

function StockList({ reportBySymbol }) {
    return <div className="table-responsive">
        <table className="table">
            <thead>
                <tr>
                    <th width={`${100 / 6}%`}>Symbol</th>
                    <th width={`${100 / 6}%`}>Profit Margin</th>
                    <th width={`${100 / 6}%`}>Return on Equity</th>
                    <th width={`${100 / 6}%`}>Current Ratio</th>
                    <th width={`${100 / 6}%`}>Payout Ratio</th>
                    <th width={`${100 / 6}%`}>Duluted EPS</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(reportBySymbol).map(symbol => {
                    return <StockRow symbol={symbol} key={symbol} data={reportBySymbol[symbol]} />
                })}
            </tbody>
        </table>
    </div>
}

function App() {
    const [idx, setIdx] = useState(0);
    const [reportBySymbol, setReportBySymbol] = useState({});
    const rowsPerPage = 10;
    const symbols = idx => TECH_SYMBOLS.slice(idx * rowsPerPage, (idx + 1) * rowsPerPage);

    useEffect(() => {
        symbols(idx).forEach(symbol => {
            if (reportBySymbol[symbol]) {
               return;
            }
            fetch(`reports/${symbol}.csv`)
                .then(res => res.text())
                .then(csvString => {
                    let data = d3.csvParse(csvString, d3.autoType);
                    data = data.slice(data.length - 5, data.length);
                    setReportBySymbol(prevState => ({ ...prevState, [symbol]: data }));
                });
        })
    // eslint-disable-next-line
    }, [idx]);

    return <div className="container">
        <h3 className="mb-3">Technology Sector</h3>
        <StockList reportBySymbol={lodash.pick(reportBySymbol, symbols(idx))} />
        <nav>
            <ul className="pagination">
                {[...Array(Math.ceil(TECH_SYMBOLS.length / 10))].map((_, i) =>
                    <li key={`page-${i}`} className={`page-item ${i === idx && 'active'}`}>
                        <span onClick={() => setIdx(i)} className="page-link">{i + 1}</span>
                    </li>
                )}
            </ul>
        </nav>
    </div>
}

export default App;
