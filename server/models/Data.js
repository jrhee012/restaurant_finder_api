const mongoose = require('mongoose');
// const crypto = require('crypto');
// const jwt = require('jsonwebtoken');
// const isEmpty = require('lodash/isEmpty');
// const find = require('lodash/find');

const { Schema } = mongoose;

const DataSchema = new Schema({
    raw_data: Schema.Types.Mixed,
    source: String,
    ext_id: String,
    created_at: {
        type: Date,
        required: true,
        default: new Date().toISOString(),
    },
    last_updated: {
        type: Date,
        required: true,
        default: new Date().toISOString(),
    },
});

DataSchema.pre('validate', function () {
    this.last_updated = new Date().toISOString();
});

DataSchema.pre('update', function () {
    this.last_updated = new Date().toISOString();
});

mongoose.model('Data', DataSchema);
