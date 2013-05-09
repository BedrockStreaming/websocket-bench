(function() {
	var Table = require('cli-table');

	var colors = require('colors');

	var Monitor = require('./monitor.js');

	/**
	* Constructor
	* @param {server} server to benchmark
	*/
	var Benchmark = function(server) {

		this.server = server;
		this.monitor = new Monitor();
		this.steps = [];
		this.workers = [];

	};

	/**
	* Launch
	* @param {connectNumber} number of connection
	* @param {concurency}    number of concurent connection
	* @param {workerNumber}  number of worker
	*/
	Benchmark.prototype.launch = function(connectNumber, concurency, workerNumber) {

		this.options = {
			connectNumber: connectNumber,
			concurency: concurency
		};

		var cp = require('child_process');

		var _this = this;

		for (var i = 0; i < workerNumber; i++) {

			this.workers[i] = cp.fork(__dirname + '/worker.js', [this.server]);

			this.workers[i].on('message', function(message) {
				if (message.action == 'done') {
					_this.processResult(message.monitor);
				};
			});
		}

		this.monitor.start();

		this.nextStep(concurency, connectNumber, concurency);

		process.on('SIGINT', function() {
		  _this.terminate();
		  process.exit();
		});





	};

	/**
	* Launch next step
	* @param {currentNumber} current number of connection
	* @param {connectNumber} number of connection
	* @param {concurency}    number of concurent connection
	*/
	Benchmark.prototype.nextStep = function(currentNumber, connectNumber, concurency) {

		if (currentNumber <= connectNumber ) {

			console.log('trying : ' + currentNumber + ' ...');

			var _this = this;
			var stepMonitor = new Monitor();
			stepMonitor.start();
			this.steps.push({
				number: currentNumber,
				monitor: stepMonitor
			})

			for (var i = 0; i < this.workers.length; i++) {

				this.workers[i].send({ msg: 'run', number :  Math.round(concurency/this.workers.length)});

			}

			setTimeout(function() {
				currentNumber += concurency;

				_this.nextStep(currentNumber, connectNumber, concurency);
			}, 1000);
		}
	};



	Benchmark.prototype.processResult = function(monitor) {

		this.monitor.merge(monitor);

		var currentStep = 0;
		for(currentStep = this.options.concurency; currentStep <= this.options.connectNumber; currentStep += this.options.concurency) {

			if (this.monitor.counter == currentStep) {

				this.findStep(currentStep).monitor.stop();
			}

			if (this.monitor.counter <= currentStep && this.monitor.counter > currentStep - this.options.concurency) {
				break;
			}
		}

		var step = this.findStep(currentStep);

		step.monitor.merge(monitor);

		if (this.monitor.counter == this.options.connectNumber ) {

			this.terminate();
		}
	};

	Benchmark.prototype.findStep = function(number) {
		for (var i = 0 ; i < this.steps.length; i++) {
			if(this.steps[i].number == number ) {
				return this.steps[i];
			}
		}
	};

	/**
	* Terminate and display result
	*/
	Benchmark.prototype.terminate = function() {

		// Stop all running monitor
		this.monitor.stop();
		this.steps[this.steps.length - 1].monitor.stop();

		for (var i = 0; i < this.workers.length; i++) {

			this.workers[i].send({ msg: 'exit'});

		}

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


	module.exports = Benchmark;

})();