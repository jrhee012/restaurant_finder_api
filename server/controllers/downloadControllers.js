const mongoose = require('mongoose');
const {
    asyncGetCache,
    redis,
    // cacheExists,
} = require('../cache');
const config = require('../config');

const Data = mongoose.model('Data');
const cacheKey = config.DATA_CACHE_KEY;
const cacheTtl = parseInt(config.CACHE_TTL, 10) * 60;

exports.allData = async (req, res) => {
    let data = [];

    try {
        let cache = await asyncGetCache(cacheKey);
        data = JSON.parse(cache);
        // console.log(typeof data)
    } catch (e) {
        console.log(e);
    }

    if (data != null) {
        console.log('> Data fetched from cache');
        return res.status(200).json(data);
    }

    try {
        data = await Data.find();
    } catch (e) {
        console.error(e);
    }

    if (data === null || data === undefined || data.length < 1) {
        return res.status(404).json(data);
    }

    try {
        redis.set(cacheKey, JSON.stringify(data), 'EX', cacheTtl);
        console.log(`> Data cached for ${cacheTtl / 60} mins`);
    } catch (e) {
        console.error(e);
    }

    return res.status(200).json(data);
}