const mongoose = require('mongoose');

const { Schema } = mongoose;

const RestaurantsSchema = new Schema({
    name: String,
    alias: String,
    categories: Schema.Types.Mixed,
    coordinates: Schema.Types.Mixed,
    location: Schema.Types.Mixed,
    display_address: Schema.Types.Mixed,
    phone_number: String,
    website: String,
    reservation: [Schema.Types.Mixed],
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

RestaurantsSchema.pre('validate', function () {
    this.last_updated = new Date().toISOString();
});

RestaurantsSchema.pre('update', function () {
    this.last_updated = new Date().toISOString();
});


mongoose.model('Restaurants', RestaurantsSchema);
