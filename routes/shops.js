const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Shop = require("../models/shops");
const User = require("../models/users");
const JWTHelper = require("../utils/jwtHelper");
const distanceCalculator = require("gps-distance");

const jwtHelper = new JWTHelper();

router.get("/all", jwtHelper.checkToken, (req, res) => {
    Promise.all([User.findById(req.user.id).populate("shops.shop").exec(), Shop.find({}).exec()])
      .then((result) => {
        const user = result[0];
        const shops = result[1];
        result = shops.filter((item) => !user.shops.map((shop) => shop.shop.id).includes(item.id))
          .sort((a, b) => distanceCalculator(...a.location.coordinates, ...user.location.coordinates) -
              distanceCalculator(...b.location.coordinates, ...user.location.coordinates)
          );
        return res.status(200).json({
          shops: result
        });
      })
      .catch((err) => res.status(500).json({error: err.message}));
});

router.post("/like-shop", jwtHelper.checkToken, (req, res) => {
    const {shopId} = req.body;
    if (!shopId)
        return res.status(400).json({});
    Promise.all([User.findOneAndUpdate({id: req.user.id}).exec(), Shop.findById(shopId).exec()])
      .then((result) => {
          let user = result[0];
          const shop = result[1];
          const likedShop =  {liked: true, disliked: false, DateOfAction: new Date(), shop: shop._id};
          user.shops.push(likedShop);
          user.save()
            .then((success) => {return res.status(202).json({})})
            .catch((error) => {return res.status(500).json({error: "an error has occurred while saving action to database"})});
      })
      .catch((error) => {return res.status(500).json({error: error})});
});

router.post("/new", jwtHelper.checkToken, (req, res) => {
    const shop = new Shop({
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