(function() {

	var Table = require('cli-table');

	var colors = require('colors');

	var Monitor = require('./lib/monitor.js');

	/**
	* Constructor
	* @param {server} server to benchmark
	*/
	var Benchmark = function(server) {

		this.server = server;
		this.monitor = new Monitor();
		this.steps = [];
	};

	/**
	* Launch
	* @param {connectNumber}
	*/
	Benchmark.prototype.launch = function(connectNumber, concurency, workerNumber) {


		this.monitor.start();
		this.nextStep(concurency, connectNumber, concurency, workerNumber);
		process.on('SIGINT', function() {
		  console.log('ctrl c pressed');
		  process.exit();
		});
	};

	/**
	* Launch
	*/
	Benchmark.prototype.nextStep = function(currentNumber, connectNumber, concurency, workerNumber) {

		if (currentNumber > connectNumber ) {
			this.monitor.stop();
			this.display();
		} else {

			console.log('trying : ' + currentNumber + ' ...');

			var _this = this;

			this.execute(concurency, workerNumber, function(stepMonitor) {

				_this.steps.push({
					number: currentNumber,
					monitor : stepMonitor
				});

				currentNumber += concurency;

				_this.nextStep(currentNumber, connectNumber, concurency, workerNumber);
			});
		}

	};

	/**
	* Launch Bench
	*/
	Benchmark.prototype.execute = function(number, workerNumber, callback) {

		var workers = [];
		var results = [];
		var monitor = new Monitor();


		monitor.start();
		for (var i = 0; i < workerNumber; i++) {

			var cp = require('child_process');

			workers[i] = cp.fork(__dirname + '/worker.js', [this.server, number/workerNumber]);

			workers[i].on('message', function(message) {
				if (message.action == 'done') {
					results.push(message.monitor);
				};
			});

			workers[i].on('error', function(message) {

				results.push({});
			});

		}

		var _this = this;

		function testDone() {

			 if (results.length == workerNumber) {

			 	monitor.stop();

			 	// Deconnect all worker
			 	for (var i = 0; i < workerNumber; i++) {
			 		workers[i].send('exit');
			 	}

			 	// Process monitor
			 	// Step monitor
			 	monitor.merge(results);
			 	// Global
			 	_this.monitor.merge(results);

			 	callback(monitor);

			 } else {
			 	setTimeout(testDone, 1000);
			 }
		};

		testDone();
	};

	/**
	* Launch Bench
	*/
	Benchmark.prototype.display = function() {



		var tableSteps = new Table({
		    head: ['Number', 'Connections', 'Errors', 'Duration(ms)']
		});

		for (var i = 0; i < this.steps.length; i++) {
			var step = this.steps[i];
			tableSteps.push([
				step.number,
				step.monitor.results.connection,
				step.monitor.results.errors,
				step.monitor.getDuration()
			]);
		}
		console.log('');
		console.log ('#### steps report ####'.inverse);
		console.log(tableSteps.toString());

		var tableTotal = new Table({
		    head: ['Connections', 'Errors', 'Duration(ms)']
		});

		tableTotal.push([
			this.monitor.results.connection,
			this.monitor.results.errors,
			this.monitor.getDuration()
		]);

		console.log ('#### total report ####'.inverse);
		console.log(tableTotal.toString());

	};

	var program = require('commander');

	program
	  .version('0.0.1')
	  .option('-s, --server [server]', 'Socket.io server to test')
	  .option('-a, --amount <n>', 'Total number of client to test', parseInt)
	  .option('-c, --concurency <n>', 'Concurent connect', parseInt)
	  .option('-w, --worker <n>', 'number of worker', parseInt)
	  .parse(process.argv);


	console.log('Launch bench with ' + program.amount + ' total connection, ' + program.concurency + ' concurent connection');
	console.log(program.worker + ' worker(s)');

	var bench  = new Benchmark(program.server);

	bench.launch(program.amount, program.concurency, program.worker);

})();