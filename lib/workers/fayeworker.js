/*global module, require*/
var i = 0;
var faye = require('faye'),
  util = require('util'),
  BaseWorker = require('./baseworker.js');

/**
 * Faye Worker class inherits form BaseWorker
 */
var FayeWorker = function (server, generator) {

  FayeWorker.super_.apply(this, arguments);
};

util.inherits(FayeWorker, BaseWorker);

FayeWorker.prototype.createClient = function (callback) {

  var faye = require('faye');
  var _this = this;

  var client = new faye.Client(this.server);

  if (_this.generator.beforeConnect) {
    _this.generator.beforeConnect(client);
  }

  client.bind('transport:down', function () {
    callback(true, client);
  });

  client.bind('transport:up', function () {
    callback(false, client);
  });

  client.connect();
};

module.exports = FayeWorker;
