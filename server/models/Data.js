const mongoose = require('mongoose');
// const crypto = require('crypto');
// const jwt = require('jsonwebtoken');
// const isEmpty = require('lodash/isEmpty');
// const find = require('lodash/find');

const { Schema } = mongoose;

const DataSchema = new Schema({
    raw_data: Schema.Types.Mixed,
    source: String,
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

mongoose.model('Data', DataSchema);
