const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Shop = require("../models/shops");
const User = require("../models/users");
const JWTHelper = require("../utils/jwtHelper");
const distanceCalculator = require("gps-distance");

const jwtHelper = new JWTHelper();

router.get("/all", jwtHelper.checkToken, (req, res) => {
    Promise.all([User.findOne({_id: req.user._id}).exec(), Shop.find({}).exec()])
      .then((result) => {
        const user = result[0];
        let shops = result[1];
        shops = shops.filter((item) => !user.shops.includes(item))
          .sort((a, b) => distanceCalculator(...a.location.coordinates, ...user.location.coordinates) -
              distanceCalculator(...b.location.coordinates, ...user.location.coordinates)
          );
        return res.status(200).json({
          shops: shops
        });
      })
      .catch((err) => {throw Error("error fetching shops List")});
});

router.post("/new", jwtHelper.checkToken, (req, res) => {
    const shop = new Shop({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        owner: req.body.owner,
        description: req.body.description,
        location: {
            type: 'Point',
            coordinates: req.body.coordinates
        }
    });
    shop.save().then(() => {
        res.status(201).json({
            success: "new Shop has been created"
        });
    }).catch(() => {
        res.status(500).json({
            error: "technical error"
        });
    });
});

module.exports = router;