'use strict';

var express = require('express'),
    path = require('path'),
    config = require('./config')
    ;

/**
 * Set up Express configuration opts.
 * @param  {httpServer} app
 */
module.exports = function (app) {

  var env = app.get('env');

  // :: Development
  //
  if (env === 'development') {

    // disable scripts + style caching
    app.use(function noCache(req, res, next) {
      if (req.url.indexOf('/js/') === 0) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
      }
      next();

      // # in a formal project, this should also serve to a dev client folder
      // TODO dev client folder
    });
  }

  // :: Production
  //
  if (env === 'production') {
    // TODO prod client settings
  }

  // # catch-all for now
  // TODO optimize this
  app.use(express.static(path.join(config.root, 'css')));
  app.use(express.static(path.join(config.root, 'js')));
  app.use(express.static(path.join(config.root, 'images')));
  app.set('views', config.root + '/views');

  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');

};