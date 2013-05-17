(function() {

	var io = require('socket.io-client'),
		util = require('util'),
        BaseWorker = require('./baseworker.js');

    /**
    * SocketIOWorker Worker class inherits form BaseWorker
    */
	var SocketIOWorker =  function(server, generator) {
        SocketIOWorker.super_.apply(this, arguments);
    };

    util.inherits(SocketIOWorker, BaseWorker);

	SocketIOWorker.prototype.createClient =function(callback) {

		var _this = this;

		var client = io.connect(this.server, { 'force new connection' : true, transports : ['websocket']});

		client.on('connect', function(){
			callback();
		});

		client.on('connect_failed', function() {
			callback(true);
		});

		client.on('error', function() {
			callback(true);
		});

		return client;
	};

	module.exports = SocketIOWorker;

})();
