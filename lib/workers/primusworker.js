(function() {

  var BaseWorker = require('./baseworker.js');
  var Primus = require('primus');
  var http = require('http');
  var util = require('util');

  // Create a primus instance in order to obtain the client constructor.
  var PrimusClient = new Primus(http.createServer()).Socket;

  var PrimusWorker = function(server, generator) {
    PrimusWorker.super_.apply(this, arguments);
  };

  util.inherits(PrimusWorker, BaseWorker);

  PrimusWorker.prototype.createClient = function(callback) {
    var client = new PrimusClient(this.server);

    client.on('open', function(){
      callback(false, client);
    });

    client.on('error', function() {
      callback(true, client);
    });

    return client;
  };

  module.exports = PrimusWorker;

})();
