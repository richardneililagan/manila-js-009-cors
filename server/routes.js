'use strict';

var api = require('./controllers/api'),
    index = require('./controllers')
    ;

module.exports = function (app) {

  // :: API

  // TODO api endpoints here
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