import React, { useEffect, useState } from "react";
import * as d3 from 'd3';
import lodash from 'lodash';
import { FaSortNumericDown, FaSortNumericUp, FaExternalLinkAlt } from "react-icons/fa";
import { Modal, Dropdown } from "react-bootstrap";
import Plot from 'react-plotly.js';
import moment from "moment";
import SYMBOL_SECTOR from "./symbolsBySector.json";

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

function App() {
    const [reportBySymbol, setReportBySymbol] = useState({});
    const [sortBy, setSortBy] = useState('profitMargin');
    const [isAscend, setIsAscend] = useState(false);
    const [isModalShow, setShowModal] = useState(false);
    const [symbol, setSymbol] = useState(null);
    const [sector, setSector] = useState('technology');

    useEffect(() => {
        const symbols = getSymbols(sector);

        symbols.forEach(symbol => {
            if (reportBySymbol[symbol]) {
                return;
            }
            fetch(`reports/${symbol}.csv`)
                .then(res => res.text())
                .then(csvString => {
                    let data = d3.csvParse(csvString, d3.autoType);
                    setReportBySymbol(prevState => ({ ...prevState, [symbol]: data }));
                });
        })
        // eslint-disable-next-line
    }, [sector]);

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

    const closeStockModal = () => {
        setShowModal(false);
        setSymbol(null);
    }
    const showStockModal = (symbol) => {
        setShowModal(true);
        setSymbol(symbol)
    }

    return <div className="container mt-3">
        <h3 className="mb-3 d-flex align-items-center">
            Sector: <Dropdown className="ml-2">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {sector.toUpperCase()}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {Object.keys(SYMBOL_SECTOR).map(sec =>
                        <Dropdown.Item key={sec} active={sec === sector} onClick={() => setSector(sec)}>
                            {sec.toUpperCase()}
                        </Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>
        </h3>
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
                    {Object.keys(lodash.pick(reportBySymbol, getSymbols(sector))).sort((a, b) => {
                        const dataA = reportBySymbol[a]
                        const dataB = reportBySymbol[b]
                        const f = ratios[sortBy];
                        const sign = isAscend ? -1 : 1;
                        return sign * (d3.mean(f(dataB)) - d3.mean(f(dataA)))
                    }).map(symbol => {
                        let data = reportBySymbol[symbol];
                        data = data.slice(data.length - 5 + 1, data.length)
                        if (data) {
                            return <tr key={symbol}>
                                <th><button className="btn btn-link btn-small p-0" onClick={() => showStockModal(symbol)}>{symbol}</button></th>
                                <td>{mean(ratios.profitMargin(data))}</td>
                                <td>{mean(ratios.roe(data))}</td>
                                <td>{mean(ratios.currentRatio(data))}</td>
                                <td>{mean(ratios.payoutRatio(data))}</td>
                                <td>{mean(ratios.dilutedEPS(data))}</td>
                            </tr>
                        } else {
                            return <tr key={symbol}>
                                <td>Loading..</td>
                                <td>Loading..</td>
                                <td>Loading..</td>
                                <td>Loading..</td>
                                <td>Loading..</td>
                                <td>Loading..</td>
                            </tr>
                        }
                    })}
                </tbody>
            </table>

            {reportBySymbol[symbol] && <Modal show={isModalShow} onHide={closeStockModal} scrollable size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <a className="d-flex align-items-center" href={`https://finance.yahoo.com/chart/${symbol}`} target="_blank">
                            {symbol} <FaExternalLinkAlt className="ml-2"/>
                        </a>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RatioPlot
                        report={reportBySymbol[symbol]}
                        title="Profit Margin"
                        key1="annualNetIncome"
                        name1="Net Income"
                        key2="annualTotalRevenue"
                        name2="Total Revenue"
                    />
                    <RatioPlot
                        report={reportBySymbol[symbol]}
                        title="Return On Equity"
                        key1="annualNetIncome"
                        name1="Net Income"
                        key2="annualStockholdersEquity"
                        name2="Stockholder's Equity"
                    />
                    <RatioPlot
                        report={reportBySymbol[symbol]}
                        title="Current Ratio"
                        key1="annualCurrentAssets"
                        name1="Current Assets"
                        key2="annualCurrentLiabilities"
                        name2="Current Liabilities"
                        factor={1}
                        y2range={[0, 5]}
                    />
                    <RatioPlot
                        report={reportBySymbol[symbol]}
                        title="Payout Ratio"
                        key1="annualCashDividendsPaid"
                        name1="Cash Dividends Paid"
                        key2="annualNetIncome"
                        name2="Net Income"
                        key1factor={-1}
                    />
                </Modal.Body>
            </Modal>}
        </div>
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

function getSymbols(sector) {
    return Array.from(new Set(SYMBOL_SECTOR[sector]));
}

function mean(values) {
    const result = d3.mean(values);
    if (result === undefined) {
        return 'NA';
    }
    return result.toFixed(1);
}