/*global module, require*/
var Monitor = require('./monitor.js'),
  StopWatch = require('./stopwatch.js'),
  Steps = require('./steps.js'),
  logger = require('./logger.js');

/**
 * Constructor
 * @param {server} server to benchmark
 */
var Benchmark = function (server, reporter, options) {
  this.server = server;
  this.monitor = new Monitor();
  this.stopwatch = new StopWatch();
  this.steps = new Steps();
  this.workers = [];
  this.options = options || {};
  this.reporter = reporter;
};

/**
 * Launch
 * @param {connectNumber} number of connection
 * @param {concurency}    number of concurent connection
 * @param {workerNumber}  number of worker
 */
Benchmark.prototype.launch = function (connectNumber, concurency, workerNumber, nbMessage) {
  var cp = require('child_process');

  this.current = {
    connectNumber : connectNumber,
    concurency    : concurency,
    nbMessage     : nbMessage || 0
  };

  for (var i = 0; i < workerNumber; i++) {

    this.workers[i] = cp.fork(__dirname + '/worker.js', [
      this.server, this.options.generatorFile, this.options.type, this.options.transport, this.options.verbose
    ]);

    this.workers[i].on('message', this._onMessage.bind(this));
  }

  this.stopwatch.start();

  if (concurency > connectNumber) {
    concurency = connectNumber;
  }

  this._nextStep(concurency, connectNumber, concurency, nbMessage);
};

Benchmark.prototype._onMessage = function(message) {
  if (message.action === 'done') {
    this._processResult(message.monitor);
  }
};

/**
 * Launch next step
 * @param {currentNumber} current number of connection
 * @param {connectNumber} number of connection
 * @param {concurency}    number of concurent connection
 * @api private
 */
Benchmark.prototype._nextStep = function (currentNumber, connectNumber, concurency, nbMessage) {
  if (this.options.verbose) {
    logger.debug('trying : ' + currentNumber + ' ...');
  }

  var _this = this;
  var stepMonitor = new Monitor();
  var stepStopWatch = new StopWatch();

  stepStopWatch.start();

  this.steps.addStep(concurency, stepMonitor, stepStopWatch);

  for (var i = 0; i < this.workers.length; i++) {
    var nbConnection = Math.round(concurency / this.workers.length);

    if (i === this.workers.length - 1) {

      nbConnection = concurency - nbConnection * i;
    }
    this.workers[i].send({ msg : 'run', number : nbConnection, nbMessage : nbMessage});
  }

  if (currentNumber < connectNumber) {
    setTimeout(function () {
      if (currentNumber >= connectNumber - concurency) {
        concurency = connectNumber - currentNumber;

        currentNumber = connectNumber;
      } else {
        currentNumber += concurency;
      }

      _this._nextStep(currentNumber, connectNumber, concurency, nbMessage);
    }, 1000);
  }
};

/**
 * Process result send by a worker
 * @param {monitor} Monitor send by the worker
 * @api private
 */
Benchmark.prototype._processResult = function (monitor) {
  this.monitor.merge(monitor);

  var step = this.steps.findStep(this.monitor.counter);

  step.monitor.merge(monitor);

  var previousStep = this.steps.previousStep(step);

  var numberForStep = (previousStep) ? step.number - previousStep.number : step.number;

  if (numberForStep === step.monitor.counter) {
    step.stopwatch.stop();
  }

  if (this.monitor.counter >= this.current.connectNumber && this.monitor.messageCounter >= (this.monitor.results.connection * this.current.nbMessage)) {

    this.terminate();
  }
};

/**
 * Terminate all running workers
 */
Benchmark.prototype.close = function () {
  for (var i = 0; i < this.workers.length; i++) {

    this.workers[i].send({ msg : 'close'});
  }
};

/**
 * Terminate and then display result
 */
Benchmark.prototype.terminate = function () {
  // Stop all running monitor
  this.stopwatch.stop();

  if (this.steps.getLastStep()) {
    this.steps.getLastStep().stopwatch.stop();
  }

  if (!this.options.keepAlive) {
    this.close();
  }

  this._report();
};

/**
 * display result if a reporter is specified
 * @api private
 */
Benchmark.prototype._report = function () {
  if (this.reporter) {
    this.reporter.report(this.steps.getSteps(), this.monitor, this.stopwatch);
  }
};

module.exports = Benchmark;
