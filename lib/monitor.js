/*global module, require*/

/**
 * Class for metrics
 */
var Monitor = function () {

  this.results = {
    connection    : 0,
    disconnection : 0,
    errors        : 0,
    msgSend       : 0,
    msgFailed     : 0
  };

  this.messageCounter = 0;

  this.counter = 0;
};


Monitor.prototype.connection = function () {
  this.results.connection++;
  this.counter++;
};

Monitor.prototype.disconnection = function () {
  this.results.disconnects++;
  this.counter++;
};

Monitor.prototype.errors = function () {
  this.results.errors++;
  this.counter++;
};

Monitor.prototype.msgSend = function () {
  this.results.msgSend++;
  this.messageCounter++;
};

Monitor.prototype.msgFailed = function () {
  this.results.msgFailed++;
  this.messageCounter++;
};

/**
 * Merge metrics
 */
Monitor.prototype.merge = function (monitor) {
  this.results.connection += monitor.results.connection;
  this.results.disconnection += monitor.results.disconnection;
  this.results.errors += monitor.results.errors;
  this.counter += monitor.counter;
  this.messageCounter += monitor.messageCounter;
  this.results.msgSend += monitor.results.msgSend;
  this.results.msgFailed += monitor.results.msgFailed;

};

module.exports = Monitor;
