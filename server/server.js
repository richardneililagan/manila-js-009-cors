'use strict';

var express = require('express');

// default node env
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./config/config');

// :: Express
var app = express();

require('./config/express')(app);
require('./routes')(app);

app.listen(config.port, config.ip, function () {
  console.log('Express server listening on %s:%d, in %s mode', config.ip, config.port, app.get('env'));
});

exports = module.exports = app;