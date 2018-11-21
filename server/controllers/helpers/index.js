const rp = require('request-promise');
const _ = require('lodash')
// const utils = require('./utils');
// const logger = require('../../logger');
const config = require('../../config');
// const { SaveRawDataWorker } = require('../../workers');

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

    async saveData(data) {

    }
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
            term: 'starbucks',
            type: 'restaurants',
            sort_by: 'best_match',
            location: query, // TODO: LOCATION REQUIRED
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
}

exports.GoogleApiClient = class GoogleApiClient extends ApiClient {
    constructor(options) {
        super(options);
        this.baseUrl = 'https://www.google.com';
    }
}
