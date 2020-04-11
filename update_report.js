const fs = require('fs')
const util = require('util')
const d3 = require('d3')
const moment = require('moment')
const readFile = util.promisify(fs.readFile)
const YEAR = 2019

main()

function main() {
    fs.readFile('./symbols.json', (err, buffer) => {
        const symbols = JSON.parse(buffer.toString())
        updateReports(symbols);
    })
}

function updateReports(symbols) {
    symbols.forEach(symbol => {
        const row = extractLatestRow(symbol)
        makeNewCsvReport(symbol, row).then(csvString => {
            fs.writeFile(`./public/reports/${symbol}.csv`, csvString, (err) => console.log(err))
        })
    })
}

function extractLatestRow(symbol) {
    return readFile(`/Users/richardng/Downloads/${symbol}.json`).then((buffer) => {
        const json = JSON.parse(buffer.toString())
        const record = {}
        json.timeseries.result.forEach(obj => {
            const type = obj.meta.type[0]
            if (obj[type]) {
                const lastItem = obj[type].slice(obj[type].length - 1)[0]
                if (moment(lastItem.asOfDate).year() === YEAR) {
                    record['date'] = lastItem.asOfDate
                    record[type] = lastItem.reportedValue.raw
                }
            }
        })
        return record
    })
}

function makeNewCsvReport(symbol, row) {
    return readFile(`./public/reports/${symbol}.csv`).then((buffer) => {
        const report = d3.csvParse(buffer.toString(), d3.autoType)
        report.push(row)
        const csvString = d3.csvFormat(report)
        return csvString
    })
}

function findSymbols() {
    // Read csv files from ./public/reports,
    fs.readdir('./public/reports', (err, fnames) => {
        const csv_files = fnames.filter(fname => fname.endsWith('.csv'))
            .filter(fname => !fname.includes('HK'))
            .filter(fname => !fname.includes('.H'))
        const prs = csv_files.map(fname => readFile(`./public/reports/${fname}`)
            .then(buffer => buffer.toString())
            .then(csvString => d3.csvParse(csvString, d3.autoType)))

        Promise.all(prs).then(reports => {
            let symbols = []

            reports.forEach((report, i) => {
                // check if it has the current year's data
                const currentYearRecord = report.find(rep => moment(rep['date']).year() === YEAR)
                // if not, fetch report / append row
                if (currentYearRecord === undefined) {
                    symbols.push(csv_files[i].replace('.csv', ''))
                }
            })

            console.log(symbols.length);
            console.log(csv_files.length);
            fs.writeFile('symbols.json', JSON.stringify(symbols), (err) => console.log(err))
        })
    })
}
