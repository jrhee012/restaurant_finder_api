const { YelpApiClient } = require('./helpers/apiClient');

exports.post = async (req, res) => {
    let yelp = new YelpApiClient();
    let result = [];
    try {
        result = await yelp.searchBusinesses();
    } catch (e) {
        console.log('make yelp api call error!');
        console.error(e);

        return res.status(500).json({
            code: 500,
            messagae: 'e.message',
            data: {},
        });
    }

    let data = result.businesses

    if (data.length < 1) {
        return res.status(404).json({
            code: 404,
            message: 'not found',
            data: {
                // query_location: query.location,
            },
        });
    }

    console.log('data length: ', data.length);
    for (let i = 0; i < data.length; i++) {
        yelp.saveYelpData(data[i]);
    }

    return res.status(200).json({
        code: res.statusCode,
        message: 'ok',
        data: {},
    });
}