(function() {

	var io = require('socket.io-client');

	var Worker = require('./Workers/SocketIOWorker.js');

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

