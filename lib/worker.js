(function() {



	var server = process.argv[2];

	var generator = require(process.argv[3]);

	var workerType = process.argv[4];

	var Worker;

	switch (workerType) {

		case 'socket.io':
			Worker = require('./Workers/SocketIOWorker.js');break;
		case 'faye':
			Worker = require('./Workers/FayeWorker.js');break;
		default:
			console.log('error workerType ' + workerType);
	}

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

