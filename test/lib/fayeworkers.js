/*global require, describe, it, beforeEach, afterEach*/

var mocha = require('mocha'),
  chai = require('chai'),
  assert = chai.assert,
  should = chai.should(),
  faye = require('faye');

var FayeWorker = require('../../lib/workers/fayeworker.js'),
  BaseWorker = require('../../lib/workers/baseworker.js'),
  Monitor = require('../../lib/monitor.js');

describe('FayeWorker', function () {
  describe('#constructor', function () {
    it('Should be an instance of base worker', function () {
      var worker = new FayeWorker('server', {});

      worker.should.be.instanceof(BaseWorker);
    });
  });

  describe('#createClient', function () {
    it('create a faye client', function (done) {
      var worker = new FayeWorker('server', {});
      worker.createClient(function (err, client) {
        client.should.be.instanceof(faye.Client);
        done();
      });
    });
  });
});