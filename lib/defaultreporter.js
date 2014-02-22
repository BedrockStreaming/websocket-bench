/*global module, require*/
var Table = require('cli-table');

/**
 * Class for display bench result
 */
var DefaultReporter = function (outputStream) {

  this.outputStream = outputStream || process.stdout;

};

DefaultReporter.prototype.report = function (steps, monitor, stopwatch) {

  var tableSteps = new Table({
    head : ['Number', 'Connections', 'Errors', 'Duration(ms)']
  });

  for (var i = 0; i < steps.length; i++) {
    var step = steps[i];

    tableSteps.push([
      step.number,
      step.monitor.results.connection,
      step.monitor.results.errors,
      step.stopwatch.getDuration()
    ]);
  }
  this.outputStream.write('\n');
  this.outputStream.write('#### steps report ####'.inverse + '\n');
  this.outputStream.write(tableSteps.toString() + '\n');

  var tableTotal = new Table({
    head : ['Number', 'Connections', 'Errors', 'Message Send', 'Message Fail', 'Duration(ms)']
  });

  tableTotal.push([
    monitor.counter,
    monitor.results.connection,
    monitor.results.errors,
    monitor.results.msgSend,
    monitor.results.msgFailed,
    stopwatch.getDuration()
  ]);

  this.outputStream.write('#### total report ####'.inverse + '\n');
  this.outputStream.write(tableTotal.toString() + '\n');

};

module.exports = DefaultReporter;