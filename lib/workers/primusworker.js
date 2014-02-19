/*global module, require*/

var BaseWorker = require('./baseworker.js'),
  Primus = require('primus'),
  http = require('http'),
  util = require('util'),
  logger = require('../logger.js');

// Create a primus instance in order to obtain the client constructor.
var PrimusClient = new Primus(http.createServer(), {'transformer' : process.argv[5]}).Socket;

var PrimusWorker = function (server, generator) {
  PrimusWorker.super_.apply(this, arguments);
};

util.inherits(PrimusWorker, BaseWorker);

PrimusWorker.prototype.createClient = function (callback) {
  var self = this,
    client = new PrimusClient(this.server);

  client.on('open', function () {
    callback(false, client);
  });

  client.on('error', function (err) {
    if (self.verbose) {
      logger.error("Primus Worker error" + JSON.stringify(err));
    }

    callback(true, client);
  });

  return client;
};

module.exports = PrimusWorker;