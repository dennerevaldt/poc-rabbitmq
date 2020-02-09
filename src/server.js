const express = require('express');

const consumerOneStart = require('./amqp/consumerOne');
const consumerTwoStart = require('./amqp/consumerTwo');
const consumerFinalResponseStart = require('./amqp/consumerFinalResponse');

const app = express();

app.use('/', require('./routes'));

app.use(function (request, response, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  consumerOneStart();
  consumerTwoStart();
  consumerFinalResponseStart();
  console.log(`Listening on PORT ${PORT}`);
});