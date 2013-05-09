(function() {

	var io = require('socket.io-client');

	var Monitor = require('./monitor.js');

	var Worker = function(server, generator) {
		this.server = server;

		this.generator = generator;

		this.clients = [];

	};

	Worker.prototype.createClient =function(monitor) {
		var client = io.connect(this.server, { 'force new connection' : true, transports : ['websocket']});

		client.on('connect', function(){
			monitor.connection();
			monitor.counter++;
		});

		client.on('connect_failed', function() {
			monitor.errors();
			monitor.counter++;
		});

		client.on('error', function() {
			monitor.errors();
			monitor.counter++;
		});

		return client;
	};

	Worker.prototype.launch =function(number) {

		var monitor = new Monitor();

		monitor.start();

		for (var i = 0; i < number ; i++) {
			this.clients.push(this.createClient(monitor));
		}

		var testDone = function() {

			if (monitor.counter == number) {
				process.send({ action: 'done', monitor: monitor });
			} else {
				setTimeout(testDone, 500);
			}
		};

		testDone();
	};

	Worker.prototype.close =function() {
		for (var i = 0; i <this.clients.length ; i++) {
			this.clients[i].disconnect();
		}
	};


	var server = process.argv[2];

	var worker = new Worker(server);

	process.on('message', function(message) {
		if(message.msg == 'exit') {
			worker.close();
			process.exit();
		}
		if(message.msg == 'run') {
			worker.launch(message.number);
		}
	});



})();

