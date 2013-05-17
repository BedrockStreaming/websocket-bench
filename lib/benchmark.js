(function() {
	var Table = require('cli-table');

	var colors = require('colors');

	var Monitor = require('./monitor.js');
	var Steps = require('./steps.js');

	/**
	* Constructor
	* @param {server} server to benchmark
	*/
	var Benchmark = function(server, generatorFile, type) {

		this.server = server;
		this.monitor = new Monitor();
		this.steps = new Steps();
		this.workers = [];
		this.generatorFile = generatorFile;
		this.type = type;

	};

	/**
	* Launch
	* @param {connectNumber} number of connection
	* @param {concurency}    number of concurent connection
	* @param {workerNumber}  number of worker
	*/
	Benchmark.prototype.launch = function(connectNumber, concurency, workerNumber, nbMessage) {

		this.options = {
			connectNumber: connectNumber,
			concurency: concurency,
			nbMessage: nbMessage
		};

		var cp = require('child_process');

		var _this = this;

		for (var i = 0; i < workerNumber; i++) {

			this.workers[i] = cp.fork(__dirname + '/worker.js', [this.server, this.generatorFile, this.type]);

			this.workers[i].on('message', function(message) {
				if (message.action == 'done') {
					_this.processResult(message.monitor);
				};
			});
		}

		this.monitor.start();

		this.nextStep(concurency, connectNumber, concurency, nbMessage);

	};

	/**
	* Launch next step
	* @param {currentNumber} current number of connection
	* @param {connectNumber} number of connection
	* @param {concurency}    number of concurent connection
	*/
	Benchmark.prototype.nextStep = function(currentNumber, connectNumber, concurency, nbMessage) {

		console.log('trying : ' + currentNumber + ' ...');

		var _this = this;
		var stepMonitor = new Monitor();

		stepMonitor.start();

		this.steps.addStep(concurency, stepMonitor);

		for (var i = 0; i < this.workers.length; i++) {

			var nbConnection = Math.round(concurency/this.workers.length);

			if (i == this.workers.length - 1) {

				nbConnection = concurency - nbConnection * i;
			}
			this.workers[i].send({ msg: 'run', number: nbConnection, nbMessage: nbMessage});
		}

		if (currentNumber < connectNumber) {

			setTimeout(function() {

				if (currentNumber >= connectNumber - concurency) {
					concurency = connectNumber - currentNumber;

					currentNumber = connectNumber;
				} else {
					currentNumber += concurency;
				}

				_this.nextStep(currentNumber, connectNumber, concurency, nbMessage);
			}, 1000);
		}

	};

	/**
	* Process result send by a worker
	* @param {monitor} Monitor send by the worker
	* @api private
	*/
	Benchmark.prototype.processResult = function(monitor) {

		this.monitor.merge(monitor);

		var step = this.steps.findStep(this.monitor.counter);

		step.monitor.merge(monitor);

		var previousStep = this.steps.previousStep(step);

		var numberForStep  = (previousStep) ? step.number - previousStep.number : step.number;

		if (numberForStep == step.monitor.counter) {
			step.monitor.stop();
		}

		if (this.monitor.counter == this.options.connectNumber && this.monitor.messageCounter == (this.monitor.results.connection * this.options.nbMessage)) {

			this.terminate();
		}
	};


	/**
	* Terminate and display result
	*/
	Benchmark.prototype.terminate = function() {

		// Stop all running monitor
		this.monitor.stop();
		this.steps.getLastStep().monitor.stop();

		for (var i = 0; i < this.workers.length; i++) {

			this.workers[i].send({ msg: 'exit'});

		}

		var tableSteps = new Table({
		    head: ['Number', 'Connections', 'Errors', 'Duration(ms)']
		});

		var steps = this.steps.getSteps();
		for (var i = 0; i < steps.length; i++) {
			var step = steps[i];
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
		    head: ['Number', 'Connections', 'Errors', 'Message Send', 'Message Fail', 'Duration(ms)']
		});

		tableTotal.push([
			this.monitor.counter,
			this.monitor.results.connection,
			this.monitor.results.errors,
			this.monitor.results.msgSend,
			this.monitor.results.msgFailed,
			this.monitor.getDuration()
		]);

		console.log ('#### total report ####'.inverse);
		console.log(tableTotal.toString());

	};

	module.exports = Benchmark;

})();
