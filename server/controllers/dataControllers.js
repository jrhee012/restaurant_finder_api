const mongoose = require('mongoose');
const isEmpty = require('lodash/isEmpty');
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
        console.log(cacheKey);
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
        console.log(cacheKey);
    } catch (e) {
        console.error(e);
    }

    return res.status(200).json(data);
}


exports.getSearch = async (req, res) => {
    const params = req.query;
    if (isEmpty(params)) {
        return res.status(400).json({
            code: res.statusCode,
            message: 'query params required',
            data: {},
        });
    }

    let data = [];

    let cacheKey = JSON.stringify(params);
    try {
        let cache = await asyncGetCache(cacheKey);
        data = JSON.parse(cache);
    } catch (e) {
        console.log(e);
    }

    if (data != null) {
        console.log(`> Data fetched from cache.`);
        console.log(cacheKey);
        let result = JSON.parse(data);
        return res.status(200).json({
            code: res.statusCode,
            message: 'ok',
            data: result,
        });
    }

    // console.log('qqq', params);
    try {
        data = await Data.find(params);
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            code: res.statusCode,
            message: 'Internal Server Error',
            data: {},
        });
    }

    if (data.length < 1) {
        return res.status(404).json({
            code: 404,
            message: 'Not Found',
            data: {},
        });
    }

    try {
        redis.set(cacheKey, JSON.stringify(data), 'EX', cacheTtl);
        console.log(`> Data cached for ${cacheTtl / 60} mins`);
        console.log(cacheKey);
    } catch (e) {
        console.error(e);
    }

    return res.status(200).json({
        code: res.statusCode,
        message: 'ok',
        data: data,
    });
}

exports.getOneById = async (req, res) => {
    let dataId = req.params.dataId;
    let data = {};

    try {
        let cache = await asyncGetCache(dataId);
        data = JSON.parse(cache);
        // console.log(typeof data)
    } catch (e) {
        console.log(e);
    }

    if (data != null) {
        console.log('> Data fetched from cache');
        console.log(dataId);

        if (isEmpty(data)) {
            return res.status(404).json({
                code: res.statusCode,
                message: 'Not Found',
                data: {},
            });
        }

        return res.status(200).json({
            code: res.statusCode,
            message: 'ok',
            data: data,
        });
    }

    try {
        data = await Data.findById(dataId);
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            code: res.statusCode,
            message: 'Internal Server Error',
            data: {},
        });
    }

    try {
        redis.set(dataId, JSON.stringify(data), 'EX', cacheTtl);
        console.log(`> Data cached for ${cacheTtl / 60} mins`);
        console.log(dataId);
    } catch (e) {
        console.error(e);
    }

    if (isEmpty(data)) {
        return res.status(404).json({
            code: res.statusCode,
            message: 'Not Found',
            data: {},
        });
    }

    return res.status(200).json({
        code: res.statusCode,
        message: 'ok',
        data: data,
    });
}

exports.create = async (req, res) => {
    let params = req.body;

    try {
        let existing = await Data.find(params);
        if (existing != null) {
            return res.status(400).json({
                code: res.statusCode,
                message: 'Existing Data',
                data: existing,
            })
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            code: res.statusCode,
            message: 'Internal Server Error',
            data: {},
        });
    }

    try {
        let newData = await Data.create(params);
        return res.status(200).json({
            code: res.statusCode,
            message: 'ok',
            data: newData,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            code: res.statusCode,
            message: e.message,
            data: e,
        });
    }
}
