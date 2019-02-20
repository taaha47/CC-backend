const mongoose = require("mongoose");
const PointSchema = require("./PointSchema");

const Schema = mongoose.Schema;

const ShopsSchema = new Schema({
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

ShopsSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
  }
});

const Shops = mongoose.model('Shops', ShopsSchema);

module.exports = Shops;