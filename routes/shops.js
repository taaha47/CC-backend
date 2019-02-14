const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Shop = require("../models/shops");
const JWTHelper = require("../utils/jwtHelper");

const jwtHelper = new JWTHelper();

router.get("/all", jwtHelper.checkToken, (req, res) => {
    Shop.find({})
        .exec()
        .then((shops) => {
            return res.status(200).json({
                shops: shops
            });
        })
        .catch((err) => {return res.status(500).json({})});
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