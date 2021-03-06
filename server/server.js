const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');
// const { asyncGetCache, redis } = require('./cache');

mongoose.promise = global.Promise;

try {
    mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true });

    console.log(`mongodb connected on: ${config.MONGODB_URI}`);

    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
        console.log('mongoose `debug` set `true`');
    }
} catch (e) {
    console.log(`cannot connect to mongodb on ${config.MONGODB_URI}!`);
    console.error(e);

    process.exit(1);
}

let server = express();

// middlewares
// server.use(cookieParser())
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use('/api', (req, res, next) => {
    let token = req.headers.token;
    // console.log('token', req.headers);
    if (!token) {
        return res.status(400).send();
    }
    if (token !== config.TOKEN) {
        return res.status(401).send();
    }
    next();
})
server.use(morgan('[:date[iso]] :method :url :status :response-time ms :remote-addr :remote-user'));
// server.use(passport.initialize());
// server.use(passport.session());

server.use(require('./routes'));

// load models
require('./models/Data');
require('./models/Restaurants');

// start cron jobs
require('./cronjobs');

// setTimeout(async () => {
//     console.log('!!!')
//     let a = await getAsync('test');
//     console.log(a);
// }, 5000);

module.exports = server;
