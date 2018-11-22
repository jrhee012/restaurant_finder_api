const rp = require('request-promise');
const _ = require('lodash');
const mongoose = require('mongoose');
// const utils = require('./utils');
// const logger = require('../../logger');
const config = require('../../config');
// const { SaveRawDataWorker } = require('../../workers');
const DBInterface = require('./data');

require('../../models/Data');

const Data = mongoose.model('Data');
const db = new DBInterface();

class ApiClient {
    constructor(options) {
        this.httpOptions = {};
        // this.setHttpOptions(options);
    }

    setHttpOptions(options) {
        let validation = false;
        try {
            validation = this._validateHttpOptions(options);
        } catch (e) {
            console.log('yelp api client validate http options error:');
            console.error(e);
        }

        if (validation) {
            this.httpOptions = options;
            console.log('http options updated');
        } else {
            console.log(`cannot set http options with: ${JSON.stringify(options)}`);
        }
    }

    _validateHttpOptions(options) {
        // TODO: UPDATE VALIDATIONS
        if (typeof options != 'object') return false;
        return true;
    }

    async makeCall(httpOptions) {
        if (_.isEmpty(httpOptions)
            && !_.isEmpty(this.httpOptions)) {
            console.log('http')
            httpOptions = this.httpOptions;
        }

        console.log(`Calling: ${JSON.stringify(httpOptions.uri)} ...`);
        console.log(`Headers: ${JSON.stringify(httpOptions.headers)}`);
        console.log(`Body: ${JSON.stringify(httpOptions.body)}`);
        console.log(`QS: ${JSON.stringify(httpOptions.qs)}`);

        const isJson = httpOptions.json;
        if (isJson === null || isJson === undefined || !isJson) {
            _.assign(httpOptions, { json: true })
        }

        const startTime = new Date();

        let result = {};
        try {
            result = await rp(httpOptions)
        } catch (e) {
            console.log('API CALL ERROR:');
            console.error(e.message);
            result = {};
        }

        // const endTime = new Date();
        // utils.logTimeDelta(startTime, endTime);

        // let w = new SaveRawDataWorker();
        // w.startWorker('worker_1', 'yelp', result);
        // rawData.save(result.businesses);

        return result;
    }

    // async saveData(data) {

    // }
}

exports.YelpApiClient = class YelpApiClient extends ApiClient {
    constructor(options) {
        super(options);
        this.baseUrl = config.YELP_BASE_URL;
    }

    _checkSearchQueries(query) {
        let term = query.term;
        let location = query.location;
        let coord = query.coord;

        if ((_.isString(term) && _.isString(location))) return true;
        // if ((_.isString(term) && _.isString(location)))
    }

    searchBusinesses(query) {
        if (query.length < 1) {
            throw new ReferenceError('query required');
        }

        let searchQueries = {
            term: query.term,
            type: 'restaurants',
            sort_by: 'best_match',
            location: query.location, // TODO: LOCATION REQUIRED
            limit: 50,
        }

        let headers = {
            'Authorization': `Bearer ${config.YELP_API_KEY}`,
        };

        let options = {
            uri: `${this.baseUrl}/businesses/search`,
            method: 'get',
            headers: headers,
            qs: searchQueries,
            json: true,
        };

        return this.makeCall(options);
    }

    saveYelpData(data) {

        // let yelp = new Data();
        // yelp.raw_data = data;
        // yelp.source = 'yelp';
        // // console.log('11111', yelp);
        // yelp.save(err => {
        //     if (err) {
        //         console.error(err);
        //         throw new Error(err.message);
        //     }
        //     console.log('yelp data saved!');
        // });

        Data.findOneAndUpdate(
            {
                ext_id: data.id,
                source: 'yelp',
            },
            {
                ext_id: data.id,
                raw_data: data,
                source: 'yelp',
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
            },
            function(err, doc) {
                if (err) {
                    console.error(err);
                }
                console.log('yelp data saved!', doc == null);
                if (doc !== null) {
                    db.findAndUpdateRestaurant(doc);
                }
                // db.findAndUpdateRestaurant(doc);
            }
        )

        // Data.findOne(
        //     {
        //         raw_data: {
        //             id: data.id,
        //         },
        //     },
        //     function (err, doc) {
        //         if (err) {
        //             console.error(err);
        //         } else {
        //             console.log('yelp data: ', doc);
        //         }
        //     }
        // )
    }
}

exports.GoogleApiClient = class GoogleApiClient extends ApiClient {
    constructor(options) {
        super(options);
        this.baseUrl = 'https://www.google.com';
    }
}
