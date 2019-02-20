const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/users");
const JWTHelper = require("../utils/jwtHelper");

const jwtHelper = new JWTHelper();

router.post("/register", (req, res) => {
    const user = User.findOne({email: req.body.email}).exec()
      .then((result) => {
        if (!result) {
          const user = new User({
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
        } else {
          return res.status(400).json({err: "user already exists"});
        }
      })
});

router.post("/login", (req, res) => {
  User.findOne({"email": req.body.email})
      .exec()
      .then((user) => {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if(err) {
            return res.status(500).json({
              failed: "Technical Error"
            });
          }
          if(result) {
            const jwtToken = jwtHelper.generateJwt({
              email: user.email,
              id: user.id
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
