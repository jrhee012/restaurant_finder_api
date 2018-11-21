const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

let server = express();

// middlewares
// server.use(cookieParser())
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(morgan('[:date[iso]] :method :url :status :response-time ms :remote-addr :remote-user'));
// server.use(passport.initialize());
// server.use(passport.session());

server.use(require('./routes'));

module.exports = server;
