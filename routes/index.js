var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send("api for codingChallenge project.");
});

module.exports = router;
