(function() {

	var io = require('socket.io-client');

	var Monitor = require('./monitor.js');

	var Worker = function(server, generator) {
		this.server = server;

		this.generator = generator;

		this.clients = [];

	};

	Worker.prototype.createClient =function(monitor, messageNumber) {

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

	Worker.prototype.launch =function(number, messageNumber) {

		var monitor = new Monitor();

		monitor.start();

		for (var i = 0; i < number ; i++) {
			this.clients.push(this.createClient(monitor, messageNumber));
		}

		var testDone = function() {

			if (monitor.counter == number && monitor.messageCounter == (monitor.results.connection * messageNumber)) {

				process.send({ action: 'done', monitor: monitor });
			} else {
				setTimeout(testDone, 500);
			}
		};

		testDone();
	};

	Worker.prototype.close =function() {
		for (var i = 0; i <this.clients.length ; i++) {
			try  {
				this.clients[i].disconnect();
			} catch (err) {

			}

		}
	};


	var server = process.argv[2];

	var generator = require(process.argv[3]);

	var worker = new Worker(server, generator);

	process.on('message', function(message) {

		if(message.msg == 'exit') {
			worker.close();
			process.exit();
		}

		if(message.msg == 'run') {
			worker.launch(message.number, message.nbMessage);
		}
	});



})();

