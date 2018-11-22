const CronJob = require('cron').CronJob;
const mongoose = require('mongoose');
// const isEmpty = require('lodash/isEmpty');

const Data = mongoose.model('Data');

// console.log('Before job instantiation');
const job = new CronJob('* 10 * * * *', async function () {
    // const d = new Date();
    // console.log('At Ten Minutes:', d);
    try {
        let data = await Data.find();
        if (data.length < 1) {
            data = [];
        }
        console.log(`Number of data entries: ${data.length}`);
    } catch (e) {
        console.log('ERROR Cron job');
        console.error(e);
    }
});
// console.log('After job instantiation');
job.start();