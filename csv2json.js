// var csv2json = require('csv2json');
// var fs = require('fs');
// const util = require('util')

// fs.readdir('./public/reports', (err, files) => {
    // const symbols = files
    //     .filter(fname => fname.includes('.csv'))
    //     .map(fname => fname.replace('.csv', ''))
//
//     symbols.forEach(sym => {
//         fs.createReadStream(`./public/reports/${sym}.csv`)
//             .pipe(csv2json())
//             .pipe(fs.createWriteStream(`./jsons/${sym}.json`));
//     })
// })

const firebase = require('firebase')
const config = {
    apiKey: "AIzaSyD_xAUl0lECnl6FCbhUnIhdXEN5xANPhuA",
    authDomain: "lngsht.firebaseapp.com",
    databaseURL: "https://lngsht.firebaseio.com",
    projectId: "lngsht",
    storageBucket: "lngsht.appspot.com",
    messagingSenderId: "709880711528",
    appId: "1:709880711528:web:b95c6f1c7512049f372edd",
    measurementId: "G-22MLMFL1F9"
};
firebase.initializeApp(config);
var database = firebase.database();

const fs = require('fs')
fs.readdir('./jsons', (err, files) => {
    files
        .filter(fname => fname.includes('.json'))
        .forEach(fname => {
            fs.readFile(`./jsons/${fname}`, (err, buffer) => {
                const json = JSON.parse(buffer.toString())
                const symbol = fname.replace(".json", "").replace(".", "_")
                firebase.database().ref('symbols/' + symbol).set(json)
                    .then(() => {
                        console.log(`OK: ${symbol}`);
                    })
                    .catch(err => {
                        console.log(`ERR: ${symbol}`, err);
                    })
            })
        })
})
