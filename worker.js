(function() {

	var io = require('socket.io-client');

	var Monitor = require('./lib/monitor.js');

	var Worker = function(server, generator) {
		this.server = server;
		this.monitor = new Monitor();
		this.generator = generator;
		this.clients = [];
	};

	Worker.prototype.createClient =function() {
		var client = io.connect(this.server, { 'force new connection' : true, transports : ['websocket']});
		var _this = this;

		client.on('connect', function(){
			_this.monitor.connection();
			_this.monitor.counter++;
		});

		client.on('connect_failed', function() {
			_this.monitor.errors();
			_this.monitor.counter++;
		});

		client.on('error', function() {
			_this.monitor.errors();
			_this.monitor.counter++;
		});

		return client;
	};

	Worker.prototype.launch =function(number) {
		this.monitor.start();

		for (var i = 0; i <number ; i++) {
			this.clients.push(this.createClient());
		}

		var _this = this;

		function testDone() {

			if (_this.monitor.counter == number) {
				process.send({ action: 'done', monitor: _this.monitor });
			} else {
				setTimeout(testDone, 500);
			}
		};
		testDone();
	};

	Worker.prototype.close =function() {
		for (var i = 0; i <this.clients ; i++) {
			this.clients[i].disconnect();
		}
	};



	var server = process.argv[2];
	var number = process.argv[3];

	var worker = new Worker(server);

	process.on('message', function(message) {
		if(message =='exit') {
			worker.close();
			process.exit();
		}
	});

	worker.launch(number);

})();

