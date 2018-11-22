const mongoose = require('mongoose');

const Data = mongoose.model('Data');

exports.allData = async (req, res) => {
    let data = [];
    try {
        data = await Data.find();
    } catch (e) {
        console.error(e);
    }

    if (data.length < 1) {
        return res.status(404).json(data);
    }

    return res.status(200).json(data);
}