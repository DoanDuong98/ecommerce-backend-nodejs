require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();
const { v4 } = require("uuid");
const Logger = require("./logger/logger.log");


// init middleware
app.use(morgan("dev")); // mode dev  // morgan("combined")  mode prd
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'];
  req.requestId = requestId || v4();
  Logger.log(`input params:: ${req.method}`, [
    req.path,
    { requestId: req.requestId },
    req.method == 'POST' ? req.body : req.query
  ]);
  next();
})

// init DB
require('./dbs/init.mongodb');
// const { checkOverload } = require('./helpers/check.connect');
// checkOverload();
// init routes
app.use('', require('./routes'));

// handling error
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  const resMessage = `${statusCode} - ${Date.now() - error.now}ms - Response: ${JSON.stringify(error)}`
  Logger.error(resMessage, [
    req.path,
    { requestId: req.requestId },
    { message: error.message }
  ])
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal server error!'
  })
})

module.exports = app;

