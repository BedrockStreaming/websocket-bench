(function () {

  var io = require('engine.io-client'),
    util = require('util'),
    BaseWorker = require('./baseworker.js'),
    logger = require('../logger.js');

  /**
   * SocketIOWorker Worker class inherits form BaseWorker
   */
  var EngineIOWorker = function (server, generator) {
	  EngineIOWorker.super_.apply(this, arguments);
  };

  util.inherits(EngineIOWorker, BaseWorker);

  EngineIOWorker.prototype.createClient = function (callback) {
    var self = this;
    var client = io(this.server);
    
    client.onopen = function(){ 
    	callback(false, client);
    };
   
    client.close = function(err){ 
    	if (self.verbose) {
            logger.error("EngineIO Worker connection closed" + JSON.stringify(err));
    	}
    	callback(true, client);
    };
    
    client.upgradeError = function(err){ 
    	if (self.verbose) {
            logger.error("EngineIO Worker upgrader error" + JSON.stringify(err));
    	}
    	callback(true, client);
    };
    
    client.error = function(err){ 
    	if (self.verbose) {
            logger.error("EngineIO Worker error: " + JSON.stringify(err));
    	}
    	callback(true, client);
    };
  };

  module.exports = EngineIOWorker;

})();
