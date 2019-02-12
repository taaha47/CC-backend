const mongoose = require("mongoose");
const PointSchema = require("./PointSchema");

const Schema = mongoose.Schema;

const ShopsSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        trim: true,
        required: true,
    },
    owner: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    location: {
        type: PointSchema,
        trim: true,
        required: true,
        default: { type: 'Point', coordinates: [-110.9903, 54.7392] }
    }
});

const Shops = mongoose.model('Shops', ShopsSchema);

module.exports = Shops;