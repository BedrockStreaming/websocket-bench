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

		var client = io.connect(this.server, { 'force new connection' : true});

		client.on('connect', function(){
			callback(false, client);
		});

		client.on('connect_failed', function() {
			callback(true, client);
		});

		client.on('error', function() {
			callback(true, client);
		});
	};

	module.exports = SocketIOWorker;

})();
