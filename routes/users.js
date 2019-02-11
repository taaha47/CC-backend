const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/users");
const JWTHelper = require("../utils/jwtHelper");

const jwtHelper = new JWTHelper();

router.post("/register", (req, res) => {
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    user.save().then(() => {
      res.status(201).json({
        success: "new User has been created"
      });
    }).catch(() => {
      res.status(500).json({
        error: "Technical error"
      });
    });
});

router.post("/login", (req, res) => {
  User.findOne({"email": req.body.email})
      .exec()
      .then((user) => {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if(err) {
            return res.status(401).json({
              failed: "Unauthorized Access"
            });
          }
          if(result) {
            const jwtToken = jwtHelper.generateJwt({
              email: user.email,
              _id: user._id
            });
            return res.status(200).json({
              token: jwtToken
            });
          }
          return res.status(401).json({
            failed: "Unauthorized Access"
          });
        });
      })
      .catch((error) => {
          res.status(500).json({
              error: "Technical Error"
          });
      });
});

module.exports = router;
