/*global module, require*/
logger = require('./logger.js');
/**
 * Define the counter limit
 */
var MAX_COUNTER = 0xFFFFFFFF;
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
  this.expectCounter = MAX_COUNTER;
  this.verbose = false;
};

Monitor.prototype.setExpectCounter = function (expectCnt) {
  this.expectCounter = expectCnt;
};

Monitor.prototype.setCounterNotifier = function (callback) {
  this.cntNotifier = callback;
};

Monitor.prototype.reachCntLimit = function () {
  if (this.counter >= this.expectCounter) {
     if (this.verbose) {
        logger.debug("Process " + process.pid + "reaches counter limit " + this.expectCounter);
     }
     if (this.cntNotifier) {
        this.cntNotifier();
     }
     return true;
  }
  return false;
};

Monitor.prototype.isRunning = function () {
  return !this.counter >= this.expectCounter;
};

Monitor.prototype.connection = function () {
  if (!this.reachCntLimit()) {
     this.results.connection++;
     this.counter++;
  } else {
     if (this.verbose) {
        logger.debug("Process " + process.pid + " in connection" +
                     " reaches counter limit " + this.expectCounter);
     }
  }
};

Monitor.prototype.disconnection = function () {
  if (!this.reachCntLimit()) {
     this.results.disconnects++;
     this.counter++;
  } else {
     if (this.verbose) {
        logger.debug("Process " + process.pid + " in disconnection" +
                     " reaches counter limit " + this.expectCounter);
     }
  }
};

Monitor.prototype.errors = function () {
  if (!this.reachCntLimit()) {
     this.results.errors++;
     this.counter++;
  } else {
     if (this.verbose) {
        logger.debug("Process " + process.pid + " in errors" +
                     " reaches counter limit " + this.expectCounter);
     }
  }
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
  if (this.expectCounter != MAX_COUNTER) {
     this.expectCounter += monitor.expectCounter;
  }
};

module.exports = Monitor;
