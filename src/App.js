import React, {useState, useEffect} from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';
import { INDICATORS, PLOT_STYLE } from './constants';
import SYMBOLS_raw from "./symbols.json";

const SYMBOLS = Array.from(new Set(SYMBOLS_raw));
const INDICATOR_keys = Object.keys(INDICATORS);

function App() {
  const [symbol, setSymbol] = useState('AAPL');
  const [indicatorKey, setIndicatorKey] = useState(INDICATOR_keys[0]);
  const [plotData, setPlotData] = useState([]);
  const [plotLayout, setPlotLayout] = useState({});

  useEffect(() => {
    fetch(`/reports/${symbol}.csv`).then(res => res.text())
      .then(csvString => {
        const data = d3.csvParse(csvString, d3.autoType);
        const indicator = INDICATORS[indicatorKey];
        setPlotData(indicator.makePlotData(data));
        setPlotLayout(indicator.makePlotLayout());
      })
  }, [symbol, indicatorKey])

  return (
    <div className="App">
      <select value={indicatorKey} onChange={evt => setIndicatorKey(evt.target.value)}>
        {INDICATOR_keys.map(key => <option key={key} value={key}>{INDICATORS[key].name}</option>)}
      </select>

      <select value={symbol} onChange={evt => setSymbol(evt.target.value)}>
        {SYMBOLS.map(symbol => <option key={symbol}>{symbol}</option>)}
      </select>

      <Plot
        data={plotData}
        layout={plotLayout}
        useResizeHandler={true}
        style={PLOT_STYLE}
      />
    </div>
  );
}

export default App;
