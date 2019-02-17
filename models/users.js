const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const PointSchema = require("./PointSchema");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    location: {
        type: PointSchema,
        trim: true,
        required: true,
        default: { type: 'Point', coordinates: [-104.9903, 39.7392] }
    },
    shops: [{
        liked: Boolean,
        disliked: Boolean,
        DateOfAction: Date,
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shops"
        }
    }]
});

UserSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;