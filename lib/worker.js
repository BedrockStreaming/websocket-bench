(function() {



	var server = process.argv[2];

	var generator = require(process.argv[3]);

	var workerType = process.argv[4];

	var Worker;

	switch (workerType) {

		case 'socket.io':
			Worker = require('./workers/socketioworker.js');break;
		case 'faye':
			Worker = require('./workers/fayeworker.js');break;
		default:
			console.log('error workerType ' + workerType);
	}

	var worker = new Worker(server, generator);

	process.on('message', function(message) {

		if(message.msg == 'close') {
			worker.close();
		}

		if(message.msg == 'run') {
			worker.launch(message.number, message.nbMessage);
		}
	});

	// On ctrl+c
	process.on('SIGINT', function() {

		worker.close();

		setTimeout(function() {

			process.exit();

		}, 3000);

	});

})();

