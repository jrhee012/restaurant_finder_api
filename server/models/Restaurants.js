const mongoose = require('mongoose');

const { Schema } = mongoose;

const RestaurantsSchema = new Schema({
    name: String,
    address: Schema.Types.Mixed,
    description: Schema.Types.Mixed,
    source_data: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Data',
        index: true
    }],
    created_at: {
        type: Date,
        required: true,
        default: new Date(),
    },
    last_updated: {
        type: Date,
        required: true,
        default: new Date(),
    },
});

mongoose.model('Restaurants', RestaurantsSchema);
