const redis = require('redis');
const { promisify } = require('util');
const config = require('../config');

const client = redis.createClient(config.REDIS_URL, {
    retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
    }
});

let cacheExists = false;
client.on('connect', () => {
    cacheExists = true;
    console.log(`Redis connected on ${config.REDIS_URL}`)
});
client.on('error', err => {
    console.log('Error ' + err);
});
client.on('end', () => {
    cacheExists = false;
    console.log('Redis client ended')
});

exports.asyncGetCache = promisify(client.get).bind(client);
exports.redis = client;
exports.cacheExists = cacheExists;

// const getAsync =