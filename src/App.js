import React, {useState, useEffect} from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';
import { INDICATORS, PLOT_STYLE } from './constants';
import SYMBOLS_raw from "./symbols.json";

const SYMBOLS = Array.from(new Set(SYMBOLS_raw));
const INDICATOR_keys = Object.keys(INDICATORS);

function App() {
  const [symbol, setSymbol] = useState('AAPL');
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetch(`/reports/${symbol}.csv`).then(res => res.text())
      .then(csvString => {
        const data = d3.csvParse(csvString, d3.autoType);
        setReport(data);
      })
  }, [symbol])

  return (
    <div className="container-fluid">
      <select value={symbol} onChange={evt => setSymbol(evt.target.value)}>
        {SYMBOLS.map(symbol => <option key={symbol}>{symbol}</option>)}
      </select>

      <div className="row">
        {INDICATOR_keys.map(key => {
          const indicator = INDICATORS[key];
          return <div className="col-12 col-md-6 p-0">
            <Plot
              data={indicator.makePlotData(report || [])}
              layout={indicator.makePlotLayout()}
              useResizeHandler={true}
              style={PLOT_STYLE}
            />
          </div>
        })}
      </div>
    </div>
  );
}

export default App;
