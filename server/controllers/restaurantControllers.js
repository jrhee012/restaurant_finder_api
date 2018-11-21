const isEmpty = require('lodash/isEmpty');
const { YelpApiClient } = require('./helpers');

exports.getRestaurants = async (req, res) => {
    const query = req.query;
    console.log(query);
    if (isEmpty(query)
    || query.location === null
    || query.location === undefined
    || query.location === '') {
        return res.status(400).json({
            code: res.statusCode,
            message: 'query location required',
            data: {},
        });
    }

    let yelp = new YelpApiClient();

    let result = [];
    try {
        result = await yelp.searchBusinesses(query.location);
    } catch (e) {
        console.log('make yelp api call error!');
        console.error(e);

        return res.status(500).json({
            code: 500,
            messagae: 'e.message',
            data: {},
        });
    }

    console.log('result: ', result);

    let data = result.businesses

    if (data.length < 1) {
        return res.status(404).json({
            code: 404,
            message: 'not found',
            data: {
                query_location: query.location,
            },
        });
    }

    return res.status(200).json({
        code: res.statusCode,
        message: 'ok',
        data: {},
    });
}
