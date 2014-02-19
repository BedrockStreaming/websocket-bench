/*global require, describe, beforeEach, afterEach, it*/

var mocha = require('mocha'),
  chai = require('chai'),
  should = chai.should(),
  sinon = require('sinon'),
  assert = chai.assert,
  faye = require('faye');

var Benchmark = require('../../lib/benchmark.js');

var port = 3337,
  benchmark = null,
  testReporter,
  server = null;

describe('Test Faye Benchmarking', function () {
  beforeEach(function () {
    testReporter = {
      report : function () {}
    };

    benchmark = new Benchmark('http://localhost:3337/faye', testReporter, {
      type : 'faye'
    });
  });

  describe('Test with a faye server working', function () {
    beforeEach(function () {
      server = new faye.NodeAdapter({mount : '/faye', timeout : 1});
      server.listen(port);
    });
    afterEach(function () {
      server.stop();
    });

    it('should connect 10 client server', function (done) {
      var connectNumber = 0;
      server.bind('handshake', function (clientId) {
        connectNumber++;
        if (connectNumber == 10) {

          done();
        }
        ;
      });

      benchmark.launch(10, 10, 1, 0);
    });

    it('should connect call reporter with 5 connection done', function (done) {
      var stubReport = sinon.stub(testReporter, 'report', function (steps, monitor) {
        assert.equal(monitor.results.connection, 5);
        assert.equal(monitor.results.errors, 0);
        testReporter.report.restore();

        done();
      });

      benchmark.launch(5, 5, 1, 0);
    });
  });
  describe('Test without faye server', function () {
    it('should connect call reporter with 10 errors', function (done) {
      var stubReport = sinon.stub(testReporter, 'report', function (steps, monitor) {
        assert.equal(monitor.results.connection, 0);
        assert.equal(monitor.results.errors, 10);
        testReporter.report.restore();

        done();
      });

      benchmark.launch(10, 10, 1, 0);
    });
  });

});
