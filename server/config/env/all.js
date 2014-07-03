'use strict';

var path = require('path');
var root = path.normalize(__dirname + '/../../..');

module.exports = {
  root : root,
  ip : '0.0.0.0',
  port : process.env.PORT || 9000
};