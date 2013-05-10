(function() {

	var Benchmark = require('./lib/benchmark.js');

	var program = require('commander');

	program
	  .version('0.0.2')
	  .usage('[options] <server>')
	  .option('-a, --amount <n>', 'Total number of persistent connection, Default to 100', parseInt)
	  .option('-c, --concurency <n>', 'Concurent connection per second, Default to 20', parseInt)
	  .option('-w, --worker <n>', 'number of worker', parseInt)
	  .option('-g, --generator <file>', 'js file for generate message or special event')
	  .option('-m, --message <n>', 'number of message for a client. Default to 0', parseInt)
	  .parse(process.argv);

	if (program.args.length < 1) {
		program.help();
	}

	var server = program.args[0];

	// Set default value
	if (!program.worker) {
		program.worker = 1;
	}

	if (!program.amount) {
		program.amount = 100;
	}

	if (!program.concurency) {
		program.concurency = 20;
	}

	if (!program.generator) {
		program.generator = __dirname + '/lib/generator.js';
	}

	if (!program.message) {
		program.message = 0;
	}

	console.log('Launch bench with ' + program.amount + ' total connection, ' + program.concurency + ' concurent connection');
	console.log(program.message + ' message(s) send by client');
	console.log(program.worker + ' worker(s)');

	var bench  = new Benchmark(server, program.generator);

	// On ctrl+c
	process.on('SIGINT', function() {
		bench.terminate();
	 	process.exit();
	});

	bench.launch(program.amount, program.concurency, program.worker, program.message);

})();
