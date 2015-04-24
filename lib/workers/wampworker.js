/*global module, require*/
var autobahn = require('autobahn'),
    util = require('util'),
    BaseWorker = require('./baseworker.js'),
    logger = require('../logger.js');

/**
 * WampWorker Worker class inherits form BaseWorker
 */
var WampWorker = function (server, generator) {
  WampWorker.super_.apply(this, arguments);
};

util.inherits(WampWorker, BaseWorker);

WampWorker.prototype.createClient = function (callback) {
  var _this = this,
      defaultOptions = {
        realm: 'realm1'
      };
  var options = _this.generator.options || defaultOptions;
  options.url = this.server;

  var connection = new autobahn.Connection(options);

  connection.onopen = function (session) {
    callback(false, session);
  };

  connection.onclose = function (reason, details) {
    if (self.verbose) {
      logger.error("WAMP Worker connection closed: " + JSON.stringify(reason));
    }
    callback(false, connection);
  };

  connection.open();
};

module.exports = WampWorker;
