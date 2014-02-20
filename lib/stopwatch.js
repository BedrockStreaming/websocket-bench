/*global module, require*/

/**
 * Class for duration metrics
 */
var StopWatch = function () {
  this.timer = {
    start : 0,
    stop  : 0
  };
};

/**
 * Start timer
 */
StopWatch.prototype.start = function () {
  this.timer.start = Date.now();
  this.timer.stop = 0;
};

/**
 * Stop timer
 */
StopWatch.prototype.stop = function () {
  if (this.timer.stop === 0) {
    this.timer.stop = Date.now();
  }
};

/**
 * get duration
 */
StopWatch.prototype.getDuration = function () {
  if (this.timer.start === 0 || this.timer.stop === 0) {
    return 0;
  }

  return this.timer.stop - this.timer.start;
};


module.exports = StopWatch;