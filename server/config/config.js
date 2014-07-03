'use strict';

module.exports = require('lodash').merge(
  require('./env/all.js'),
  require('./env/' + process.env.NODE_ENV + '.js') || {}
  );