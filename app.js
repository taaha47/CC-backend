const express = require('express');
const logger = require('morgan');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require("./routes/users");
const shopsRouter = require("./routes/shops");

const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());

if (app.get("env") === "production") {
    app.use(logger("combined"));
} else {
    app.use(logger("dev"));
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/shops", shopsRouter);

app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development'
        ? err
        : new Error("internal Error");

    res.status(err.status || 500);
    next(res.locals.error);
});

//mongoDb conf
const dbUri = process.env.DB_HOST || "mongodb://localhost:27017/coding-challenge";
mongoose.connect(dbUri, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = app;
