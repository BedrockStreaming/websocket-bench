/*global require, describe, it, xit, beforeEach, afterEach*/

var mocha = require('mocha'),
  chai = require('chai'),
  should = chai.should(),
  sinon = require('sinon'),
  assert = chai.assert;

var BaseWorker = require('../../lib/workers/baseworker.js');

var worker = null;
var monitor = null;

describe('BaseWorker', function () {
  beforeEach(function () {
    worker = new BaseWorker('/', {});
  });

  describe('#constructor', function () {
    it('Should be an instance of base worker', function () {
      worker = new BaseWorker('server', {});

      worker.should.be.instanceof(BaseWorker);
    });

    it(' clients must be an empty array', function () {
      worker = new BaseWorker('server', {});

      worker.should.have.property('clients').be.an('Array').with.length(0);

    });
  });

  describe('#launch', function () {
    //Commented out test since it doesn't work as expected
    //The callbacks aren't executed when stubbing methods, therefore
    //The test hangs. When running with mocha you will see that it isn't functioning
    //As Expected, IE Change values and it still passes.
    xit('Should create <number> of clients with <numberMsg>', function () {
      var stubCreateClient = sinon.stub(worker, 'createClient');

      worker.launch(3, 2);

      assert(stubCreateClient.calledThrice);
      assert(stubCreateClient.withArgs(2));
    });
  });

  describe('#_onMessageSend', function () {
    it('if no err should call monitor.msgSend()', function () {
      var monitor = {msgSend : function () {}},
        spyMsgSend = sinon.spy(monitor, "msgSend"),
        stubCreateClient = sinon.stub(worker, 'createClient');

      worker._onMessageSend(monitor);
      assert(spyMsgSend.calledOnce);
    });

    it('if an err occur should call monitor.msgFail()', function () {
      var monitor = {msgFailed : function () {}},
        spyMsgFailed = sinon.spy(monitor, "msgFailed"),
        stubCreateClient = sinon.stub(worker, 'createClient');

      worker._onMessageSend(monitor, true);

      assert(spyMsgFailed.calledOnce);

    });
  });
});
