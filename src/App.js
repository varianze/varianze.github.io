import React, { useEffect, useState } from "react";
import * as d3 from 'd3';
import { FaSortNumericDown, FaSortNumericUp } from "react-icons/fa";
import symbolBySectors from "./symbolsBySector.json";

const TECH_SYMBOLS = Array.from(new Set(symbolBySectors['technology']));
const profitMargin = data => data.map(dat => (dat['annualNetIncome'] / dat['annualTotalRevenue'] * 100));
const roe = data => data.map(dat => (dat['annualNetIncome'] / dat['annualStockholdersEquity'] * 100));
const currentRatio = data => data.map(dat => (dat['annualCurrentAssets'] / dat['annualCurrentLiabilities']));
const payoutRatio = data => data.map(dat => (-1 * dat['annualCashDividendsPaid'] / dat['annualNetIncome'] * 100));
const dilutedEPS = data => data.map(dat => (dat['annualDilutedEPS'] || 0));

const ratios = {
    profitMargin,
    roe,
    currentRatio,
    payoutRatio,
    dilutedEPS,
}


function StockRow({ symbol, data }) {
    if (data) {
        return <tr>
            <th>{symbol}</th>
            <td>{d3.mean(ratios.profitMargin(data)).toFixed(1)}</td>
            <td>{d3.mean(ratios.roe(data)).toFixed(1)}</td>
            <td>{d3.mean(ratios.currentRatio(data)).toFixed(1)}</td>
            <td>{d3.mean(ratios.payoutRatio(data)).toFixed(1)}</td>
            <td>{d3.mean(ratios.dilutedEPS(data)).toFixed(1)}</td>
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


function App() {
    const [reportBySymbol, setReportBySymbol] = useState({});
    const [sortBy, setSortBy] = useState('profitMargin');
    const [isAscend, setIsAscend] = useState(false);

    useEffect(() => {
        TECH_SYMBOLS.forEach(symbol => {
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
    }, []);

    const onSortClick = by => {
        if (by === sortBy) {
            setIsAscend(!isAscend);
        } else {
            setSortBy(by);
            setIsAscend(false);
        }
    }

    const sortIcon = by => by === sortBy ?
        isAscend ? <FaSortNumericUp /> : <FaSortNumericDown /> :
        null;

    return <div className="container">
        <h3 className="mb-3">Technology Sector</h3>
        <div className="table-responsive">
            <table className="table">
                <thead>
                    <tr>
                        <th width={`${100 / 6}%`}>Symbol</th>
                        <th width={`${100 / 6}%`} onClick={() => onSortClick('profitMargin')}>Profit Margin {sortIcon('profitMargin')}</th>
                        <th width={`${100 / 6}%`} onClick={() => onSortClick('roe')}>Return on Equity {sortIcon('roe')}</th>
                        <th width={`${100 / 6}%`} onClick={() => onSortClick('currentRatio')}>Current Ratio {sortIcon('currentRatio')}</th>
                        <th width={`${100 / 6}%`} onClick={() => onSortClick('payoutRatio')}>Payout Ratio {sortIcon('payoutRatio')}</th>
                        <th width={`${100 / 6}%`} onClick={() => onSortClick('dilutedEPS')}>Duluted EPS {sortIcon('dilutedEPS')}</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(reportBySymbol).sort((a, b) => {
                        const dataA = reportBySymbol[a]
                        const dataB = reportBySymbol[b]
                        const f = ratios[sortBy];
                        const sign = isAscend ? -1 : 1;
                        return sign * (d3.mean(f(dataB)) - d3.mean(f(dataA)))
                    }).map(symbol => {
                        return <StockRow symbol={symbol} key={symbol} data={reportBySymbol[symbol]} />
                    })}
                </tbody>
            </table>
        </div>
    </div>
}

export default App;
