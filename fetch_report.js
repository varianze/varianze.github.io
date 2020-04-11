
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
