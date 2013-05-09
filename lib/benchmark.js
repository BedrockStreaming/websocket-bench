(function() {
	var Table = require('cli-table');

	var colors = require('colors');

	var Monitor = require('./monitor.js');

	/**
	* Constructor
	* @param {server} server to benchmark
	*/
	var Benchmark = function(server, generatorFile) {

		this.server = server;
		this.monitor = new Monitor();
		this.steps = [];
		this.workers = [];
		this.generatorFile = generatorFile;

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

			this.workers[i] = cp.fork(__dirname + '/worker.js', [this.server, this.generatorFile]);

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
				this.workers[i].send({ msg: 'run', number :  Math.round(concurency/this.workers.length), nbMessage: nbMessage});
			}

			setTimeout(function() {
				currentNumber += concurency;

				_this.nextStep(currentNumber, connectNumber, concurency, nbMessage);
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

		if (this.monitor.counter == this.options.connectNumber && this.monitor.messageCounter == (this.options.connectNumber * this.options.nbMessage)) {

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