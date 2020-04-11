
function fetchReport(symbol) {
    let period1 = 493590046
    let period2 = 1586601709
    let attributes = [
        "annualChangeInCashSupplementalAsReported",
        "annualBeginningCashPosition",
        "annualCurrentAssets",
        "annualGrossPPE",
        "annualNetIncomeCommonStockholders",
        "annualOtherNonCurrentLiabilities",
        "annualInterestExpense",
        "annualRepaymentOfDebt",
        "annualOtherIncomeExpense",
        "annualSellingGeneralAndAdministration",
        "annualCapitalExpenditure",
        "annualBasicEPS",
        "annualTotalNonCurrentAssets",
        "annualOtherCurrentLiabilities",
        "annualCashFlowFromContinuingFinancingActivities",
        "annualCurrentDebt",
        "annualInventory",
        "annualOtherCurrentAssets",
        "annualCostOfRevenue",
        "annualTotalRevenue",
        "annualCapitalStock",
        "annualPurchaseOfBusiness",
        "annualNetOtherFinancingCharges",
        "annualFreeCashFlow",
        "annualTotalLiabilitiesNetMinorityInterest",
        "annualAccumulatedDepreciation",
        "annualBasicAverageShares",
        "annualGrossProfit",
        "annualNetIncomeContinuousOperations",
        "annualChangeInWorkingCapital",
        "annualOperatingExpense",
        "annualChangeInInventory",
        "annualNonCurrentDeferredTaxesLiabilities",
        "annualNonCurrentDeferredRevenue",
        "annualNetIncome",
        "annualRetainedEarnings",
        "annualAccountsReceivable",
        "annualPurchaseOfInvestment",
        "annualCashDividendsPaid",
        "annualGoodwill",
        "annualSaleOfInvestment",
        "annualPretaxIncome",
        "annualOtherNonCashItems",
        "annualDepreciationAndAmortization",
        "annualInvestingCashFlow",
        "annualOperatingIncome",
        "annualLongTermDebt",
        "annualStockholdersEquity",
        "annualEndCashPosition",
        "annualTotalAssets",
        "annualTaxProvision",
        "annualCurrentLiabilities",
        "annualDilutedEPS",
        "annualOperatingCashFlow",
        "annualTotalNonCurrentLiabilitiesNetMinorityInterest",
        "annualAccountsPayable",
        "annualOtherIntangibleAssets",
        "annualOtherShortTermInvestments",
        "annualCommonStockIssuance",
        "annualDilutedAverageShares",
        "annualInvestmentsAndAdvances",
        "annualRepurchaseOfCapitalStock",
        "annualOtherNonCurrentAssets",
        "annualGainsLossesNotAffectingRetainedEarnings",
        "annualEbitda",
        "annualNetPPE",
        "annualCashAndCashEquivalents",
        "annualNetOtherInvestingChanges",
        "annualCashCashEquivalentsAndMarketableSecurities",
        "annualCurrentDeferredRevenue",
        "annualChangeInAccountPayable",
        "annualResearchAndDevelopment",
        "annualStockBasedCompensation",
        "annualDeferredIncomeTax",
        "annualIncomeTaxPayable",
        "annualChangesInAccountReceivables",
        "annualCurrentAccruedExpenses"
    ];

    fetch(`https://query2.finance.yahoo.com/ws/fundamentals-timeseries/v1/finance/timeseries/${symbol}?symbol=${symbol}&period1=${period1}&period2=${period2}&type=${attributes.join(',')}`)
    .then(res => res.json())
    .then(json => downloadJson(json, `${symbol}.json`))
}

function downloadJson(json, fname) {
    let anchor = document.createElement('a');
    anchor.download = fname;
    anchor.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
    anchor.click()
}

function checkMissing() {
    fs.readFile('./symbols.json', (err, buffer) => symbols = JSON.parse(buffer.toString()))
    fs.readdir('/Users/richardng/Downloads', (err, fnames) => {
        const json_files = fnames.filter(fname => fname.endsWith('.json'))
        const missing = symbols.filter(sym => !json_files.includes(`${sym}.json`))
        console.log(missing.length);

        fs.writeFile('missing.json', JSON.stringify(missing), (err) => console.log(err))
    })
}

i = 0
interval = setInterval(() => {
    const batch_size = 10
    if (i * batch_size > symbols.length) {
        clearInterval(interval)
        return
    }
    console.log(i)
    symbols.slice(i * batch_size, (i + 1) * batch_size).forEach(symbol => fetchReport(symbol))
    i += 1
}, 5000)
