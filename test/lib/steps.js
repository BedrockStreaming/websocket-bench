/*global require, describe, it, beforeEach, afterEach*/
var mocha = require('mocha'),
  chai = require('chai'),
  should = chai.should(),
  assert = chai.assert;

var Steps = require('../../lib/steps.js');

describe('Steps', function () {
  describe('#constructor', function () {
    it('steps._steps must be an empty array', function () {
      var steps = new Steps();

      steps._steps.should.be.an('Array');
      steps._steps.should.have.length(0);
    });
  });

  describe('#addStep', function () {
    it('createStep must add a step to _steps', function () {
      var steps = new Steps();

      steps.addStep(10, {}, {});

      steps._steps.should.be.an('Array');
      steps._steps.should.have.length(1);
    });
  });

  describe('#findStep', function () {
    it('must return null if not step found', function () {
      var steps = new Steps();

      should.not.exist(steps.findStep(10));
    });

    it('must return step if step found', function () {
      var steps = new Steps();

      steps.addStep(10, {}, {});

      should.exist(steps.findStep(10));
    });
  });

  describe('#previousStep', function () {
    it('must return null if _steps is empty', function () {
      var steps = new Steps();

      should.not.exist(steps.previousStep({number : 10}));
    });

    it('must return null if step is first steps in _steps', function () {
      var steps = new Steps();

      steps.addStep(10, {}, {});
      steps.addStep(10, {}, {});

      should.not.exist(steps.previousStep({number : 10}));
    });

    it('must return step if step is second steps in _steps', function () {
      var steps = new Steps();

      steps.addStep(10, {}, {});
      steps.addStep(10, {}, {});

      var step = steps.previousStep({number : 20});
      should.exist(step);
      step.should.have.property('number').equal(10);
    });
  });

  describe('#getLastStep', function () {
    it('must return null if _steps is empty', function () {
      var steps = new Steps();

      should.not.exist(steps.getLastStep());
    });

    it('must return last step', function () {
      var steps = new Steps();

      steps.addStep(10, {}, {});
      steps.addStep(10, {}, {});

      var step = steps.getLastStep();

      should.exist(step);
      step.should.have.property('number').equal(20);
    });
  });

  describe('#getSteps', function () {
    it('wtih two steps must array with added steps', function () {
      var steps = new Steps();

      steps.addStep(10, {}, {});
      steps.addStep(10, {}, {});

      var getSteps = steps.getSteps();

      steps.should.have.property('_steps').equal(getSteps);
    });

    it('with no steps must return an empty array', function () {
      var steps = new Steps();

      var getSteps = steps.getSteps();

      steps._steps.should.be.an('Array');
      steps._steps.should.have.length(0);
    });
  });
});
