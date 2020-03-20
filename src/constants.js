export const INDICATORS = {
    profitability: {
        name: 'Profitability',
        makePlotData: data => {
            const date = data.map(dat => dat['date']);
            const annualNetIncome = data.map(dat => dat['annualNetIncome']);
            const annualTotalRevenue = data.map(dat => dat['annualTotalRevenue']);
            const profitMargin = data.map(dat => dat['annualNetIncome'] / dat['annualTotalRevenue'] * 100);
            const revenueGrowth = makeGrowthRate(annualTotalRevenue).map(v => 100 * v);
            const incomeGrowth = makeGrowthRate(annualNetIncome).map(v => 100 * v);
            return [
                { x: date, y: annualNetIncome, name: 'Net Income', type: 'bar', },
                { x: date, y: annualTotalRevenue, name: 'Total Revenue', type: 'bar', },
                { x: date, y: profitMargin, name: 'Profit Margin', yaxis: 'y2', },
                { x: date, y: revenueGrowth, name: 'Revenue Growth', yaxis: 'y2', },
                { x: date, y: incomeGrowth, name: 'Income Growth', yaxis: 'y2', },
            ];
        },
        makePlotLayout: () => {
            return {
                title: 'Profitability',
                xaxis: {rangeslider: true,},
                yaxis2: { overlaying: 'y', side: 'right' },
            }
        },
    },
    manageEff: {
        name: 'Management Efficiency',
        makePlotData: data => {
            const date = data.map(dat => dat['date']);
            const annualNetIncome = data.map(dat => dat['annualNetIncome']);
            const annualTotalAssets = data.map(dat => dat['annualTotalAssets']);
            const annualStockholdersEquity = data.map(dat => dat['annualStockholdersEquity']);
            const roa = data.map(dat => dat['annualNetIncome'] / dat['annualTotalAssets'] * 100);
            const roe = data.map(dat => dat['annualNetIncome'] / dat['annualStockholdersEquity'] * 100);
            return [
                { x: date, y: annualNetIncome, name: 'Net Income', type: 'bar', },
                { x: date, y: annualStockholdersEquity, name: 'Stockholders Equity', type: 'bar', },
                { x: date, y: annualTotalAssets, name: 'Total Assets', type: 'bar', },
                { x: date, y: roa, name: 'ROA', yaxis: 'y2', },
                { x: date, y: roe, name: 'ROE', yaxis: 'y2', },
            ];
        },
        makePlotLayout: () => {
            return {
                title: 'Return On Assets',
                xaxis: {rangeslider: true,},
                yaxis2: { overlaying: 'y', side: 'right' },
            }
        },
    },
    perShareStats: {
        name: 'Per Share Stats',
        makePlotData: data => {
            const date = data.map(dat => dat['date']);
            const annualDilutedEPS = data.map(dat => dat['annualDilutedEPS']);
            const totalCashPerShare = data.map(dat => (dat['annualCashAndCashEquivalents'] + dat['annualOtherShortTermInvestments']) / (dat['annualNetIncome'] / dat['annualBasicEPS']));
            const bookValuePerShare = data.map(dat => dat['annualStockholdersEquity'] / (dat['annualNetIncome'] / dat['annualBasicEPS']));
            return [
                { x: date, y: annualDilutedEPS, name: 'Diluted EPS', },
                { x: date, y: totalCashPerShare, name: 'Total Cash Per Share', },
                { x: date, y: bookValuePerShare, name: 'Book Value Per Share', },
            ];
        },
        makePlotLayout: () => {
            return {
                title: 'Per Share Stats',
                xaxis: {rangeslider: true,},
            }
        },
    },
    debtToEq: {
        name: 'Debt to Equity Ratio',
        makePlotData: data => {
            const date = data.map(dat => dat['date']);
            const totalLiab = data.map(dat => dat['annualTotalLiabilitiesNetMinorityInterest']);
            const totalEq = data.map(dat => dat['annualStockholdersEquity']);
            const d2e = data.map(dat => dat['annualTotalLiabilitiesNetMinorityInterest'] / dat['annualStockholdersEquity']);
            return [
                { x: date, y: totalLiab, name: 'Total Liabilities', type: 'bar', },
                { x: date, y: totalEq, name: "Total Shareholders' Equity", type: 'bar', },
                { x: date, y: d2e, name: 'Debt to Equity Ratio', yaxis: 'y2', },
            ];
        },
        makePlotLayout: () => {
            return {
                title: 'Debt to Equity Ratio',
                xaxis: {rangeslider: true,},
                yaxis2: { overlaying: 'y', side: 'right' },
            }
        },
    },
    currentRatio: {
        name: 'Current Ratio',
        makePlotData: data => {
            const date = data.map(dat => dat['date']);
            const currentAsset = data.map(dat => dat['annualCurrentAssets']);
            const ccurrentLiabilities = data.map(dat => dat['annualCurrentLiabilities']);
            const ratio = data.map(dat => dat['annualCurrentAssets'] / dat['annualCurrentLiabilities']);
            return [
                { x: date, y: currentAsset, name: 'Current Assets ', type: 'bar', },
                { x: date, y: ccurrentLiabilities, name: "Current Liabilities", type: 'bar', },
                { x: date, y: ratio, name: 'Current Ratio', yaxis: 'y2', },
            ];
        },
        makePlotLayout: () => {
            return {
                title: 'Current Ratio',
                xaxis: {rangeslider: true,},
                yaxis2: { overlaying: 'y', side: 'right' },
            }
        },
    },
    payoutRatio: {
        name: 'Payout Ratio',
        makePlotData: data => {
            const date = data.map(dat => dat['date']);
            const dividend = data.map(dat => -1 * dat['annualCashDividendsPaid']);
            const income = data.map(dat => dat['annualNetIncome']);
            const ratio = data.map(dat => -100 * dat['annualCashDividendsPaid'] / dat['annualNetIncome']);
            return [
                { x: date, y: dividend, name: 'Dividends Paid', type: 'bar', },
                { x: date, y: income, name: "Net Income", type: 'bar', },
                { x: date, y: ratio, name: 'Payout Ratio', yaxis: 'y2', },
            ];
        },
        makePlotLayout: () => {
            return {
                title: 'Payout Ratio',
                xaxis: {rangeslider: true,},
                yaxis2: { overlaying: 'y', side: 'right' },
            }
        },
    }
}

export const PLOT_STYLE = {width: '100%', height: '100%'}

function makeGrowthRate(values) {
    return values.map((val, i) => {
        if (i === 0) {
            return;
        }
        return (val - values[i - 1]) / values[i - 1];
    })
}