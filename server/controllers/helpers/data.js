const mongoose = require('mongoose');
const config = require('../../config');
require('../../models/Data');
require('../../models/Restaurants');

// const Data = mongoose.model('Data');
const Restaurants = mongoose.model('Restaurants');

class DBInterface {
    constructor() {
        this.name = 'DBInterface';
        this.data = [];
        this.restaurants = [];
    }

    findAndUpdateRestaurant(data) {
        // console.log('db interface data: ', data);
        if (data === null) {
            return;
        }
        let name = '';
        let coords = {};
        let source = data.source;
        if (source === 'yelp') {
            let rawData = data.raw_data;
            // console.log('rawqwwwwww: ', rawData);
            name = rawData.name;
            coords = rawData.location;

            Restaurants.findOneAndUpdate({
                name: name,
                location: coords,
            },
            {
                name: name,
                alias: rawData.name,
                categories: rawData.categories,
                coordinates: rawData.coordinates,
                location: rawData.location,
                display_address: rawData.location.display_address,
                phone_number: rawData.phone,
                reservation: ['yelp'],
                source_data: [data._id],
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
                console.log('restaurant data saved!');
            })
        }
    }

    // getData(restaurant) {}
}

module.exports = DBInterface;
