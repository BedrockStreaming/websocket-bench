/*global require, describe, it, beforeEach, afterEach*/

var mocha = require('mocha'),
  chai = require('chai'),
  should = chai.should(),
  sinon = require('sinon'),
  assert = chai.assert;

var Benchmark = require('../../lib/benchmark.js');
var benchmark = null;

describe('Benchmark', function () {
  beforeEach(function () {
    benchmark = new Benchmark();
  });

  describe('#terminate', function () {
    it('should call close if no keepAlive options', function () {
      var stubClose = sinon.stub(benchmark, 'close');

      benchmark.terminate();

      assert(stubClose.called);
    });

    it('shouldn\'t call close if keepAlive options', function () {
      var stubClose = sinon.stub(benchmark, 'close');

      benchmark.options.keepAlive = true;
      benchmark.terminate();

      assert(stubClose.notCalled);
    });

    it('should call _report method for display', function () {
      var stub = sinon.stub(benchmark, '_report');

      benchmark.terminate();

      assert(stub.called);
    });
  });
});