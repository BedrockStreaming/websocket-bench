/*global require, describe, it, beforeEach, afterEach*/
var mocha = require('mocha'),
  chai = require('chai'),
  should = chai.should(),
  assert = chai.assert;

var StopWatch = require('../../lib/stopwatch.js');
var stopwatch = null;

describe('StopWatch', function () {

  beforeEach(function () {
    stopwatch = new StopWatch();

  });

  describe('#constructor', function () {
    it('Timer must be equal to 0', function () {
      stopwatch.timer.start.should.equal(0);
      stopwatch.timer.stop.should.equal(0);
    });
  });

  describe('#getDuration', function () {
    it('If monitor not started and not stoped must return 0', function () {
      ;
      stopwatch.getDuration().should.equal(0);
    });

    it('If monitor not started must return 0', function () {
      stopwatch.stop();

      stopwatch.getDuration().should.equal(0);
    });

    it('If monitor not stoped must return 0', function () {
      stopwatch.start();

      stopwatch.getDuration().should.equal(0);
    });

    it('If monitor started and then stoped must return a positive value', function () {
      stopwatch.start();

      stopwatch.stop();

      assert.isNumber(stopwatch.getDuration());
    });
  });
});
