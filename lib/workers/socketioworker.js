(function() {

	var io = require('socket.io-client'),
		util = require('util'),
        BaseWorker = require('./baseworker.js');

	var SocketIOWorker =  function(server, generator) {
        SocketIOWorker.super_.apply(this, arguments);
    };

    util.inherits(SocketIOWorker, BaseWorker);

	SocketIOWorker.prototype.createClient =function(monitor, messageNumber) {

		var _this = this;

		var client = io.connect(this.server, { 'force new connection' : true, transports : ['websocket']});

		client.on('connect', function(){

			_this.generator.onConnect(client, function(err) {

				if(err) {
					monitor.errors();
				} else {
					monitor.connection();

					for (var i = 0; i < messageNumber; i++) {
						_this.generator.sendMessage(client, function(err) {
							if(err) {
								monitor.msgFailed();
							} else {
								monitor.msgSend();
							}
						});
					}
				}

			});
		});

		client.on('connect_failed', function() {
			monitor.errors();
		});

		client.on('error', function() {
			monitor.errors();
		});

		return client;
	};

	module.exports = SocketIOWorker;

})();