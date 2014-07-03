'use strict';

var api = require('./controllers/api'),
    index = require('./controllers')
    ;

module.exports = function (app) {

  // :: API

  // # uncomment this to allow CORS for all domains
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    //res.header('Access-Control-Max-Age', '3600');

    next();
  });

  app.route('/api/foo')
    .all(api.foo)
    ;

  // any undefined API endpoints hit a 404
  app.route('/api/*')
    .all(function (req, res) {
      res.send(404);
    });


  // :: Documents

  app.route('/partials/*')
    .get(index.partials)
    ;
  app.route('/*')
    .get(index.index)
    ;
};