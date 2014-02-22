/*global module, require*/

/**
 * Class for stock steps
 */
var Steps = function () {
  this._steps = [];
};

/**
 * Return last step or null
 * @return Object
 */
Steps.prototype.getLastStep = function () {
  if (this._steps.length === 0) {
    return null;
  }
  return this._steps[this._steps.length - 1];
};

/**
 * Return _steps
 * @return Object
 */
Steps.prototype.getSteps = function () {
  return this._steps;
};

/**
 * Add a step at the end of steps
 * @param {number} number of connection for the step
 * @param {monitor} monitor associed to the step
 * @param {stopwatch} stopwatch timer associed to the step
 */
Steps.prototype.addStep = function (number, monitor, stopwatch) {
  var lastStep = this.getLastStep();

  if (lastStep) {
    number = lastStep.number + number;
  }

  this._steps.push({
    number  : number,
    monitor : monitor,

    stopwatch : stopwatch
  });
};

/**
 * Find step for a number of connection
 * @param {step} step
 * @return step or null
 * @api private
 */
Steps.prototype.findStep = function (number) {
  for (var i = 0; i < this._steps.length; i++) {
    var nextStep = this._steps[i + 1];
    if (this._steps[i].number >= number && (!nextStep || number < nextStep.number  )) {
      return this._steps[i];
    }
  }
  return null;
};

/**
 * Get previous step for a step
 * @param {step} step
 * @api private
 */
Steps.prototype.previousStep = function (step) {
  var prevStep = null;
  for (var i = 0; i < this._steps.length; i++) {
    if (this._steps[i].number >= step.number) {
      return prevStep;
    }
    prevStep = this._steps[i];
  }
  return null;
};

module.exports = Steps;