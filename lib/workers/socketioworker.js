/*global module, require*/
var io       = require('socket.io-client'),
  util       = require('util'),
  BaseWorker = require('./baseworker.js'),
  logger     = require('../logger.js');

/**
 * SocketIOWorker Worker class inherits form BaseWorker
 */
var SocketIOWorker = function (server, generator) {
  SocketIOWorker.super_.apply(this, arguments);
};

util.inherits(SocketIOWorker, BaseWorker);

SocketIOWorker.prototype.createClient = function (callback) {
  var self = this;
  var options = {
    'force new connection' : true
  };
  if (self.generator.options) {
    for (var k in self.generator.options) {
      if (self.generator.options[k] !== null || self.generator.options[k] !== '') {
        options[k] = self.generator.options[k];
      }
    }
  }
  var client = io.connect(this.server, options);

  client.on('connect', function () {
    callback(false, client);
  });

  client.on('connect_error', function (err) {
    if (self.verbose) {
      logger.error("SocketIO Worker connect_failed" + JSON.stringify(err));
    }
    callback(true, client);
  });

  client.on('error', function (err) {
    if (self.verbose) {
      logger.error("SocketIO Worker error: " + JSON.stringify(err));
    }
    callback(true, client);
  });
};

module.exports = SocketIOWorker;
