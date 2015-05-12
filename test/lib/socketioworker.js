/*global require, describe, it, beforeEach, afterEach*/
var mocha   = require('mocha'),
  chai      = require('chai'),
  assert    = chai.assert,
  should    = chai.should(),
  io        = require('socket.io-client')
  sinon     = require('sinon');

var SocketIOWorker = require('../../lib/workers/socketioworker.js'),
  BaseWorker = require('../../lib/workers/baseworker.js'),
  Monitor = require('../../lib/monitor.js');

var socketClient = null;

describe('SocketIOWorker', function () {
  beforeEach(function() {
    socketClient = {
      on: function() {}
    };

    sinon.stub(io, 'connect').returns(socketClient);
  });

  afterEach(function() {
    io.connect.restore();
  });

  describe('#constructor', function () {
    it('Should be an instance of base worker', function () {
      var worker = new SocketIOWorker('server', {});

      worker.should.be.instanceof(BaseWorker);
    });
  });

  describe('#createClient', function () {
    it('create a socket.io client', function (done) {
      socketClient.on = function(event, cb) {
        if (event == 'connect') {
          cb(false, socketClient);
        }
      };

      var worker = new SocketIOWorker('server', {});
      worker.createClient(function (err, client) {

        client.should.be.equal(socketClient);
        done();
      });
    });
  });
});

setTimeout(function() {
  //_getActiveHandles
    console.log(process._getActiveHandles());
  }, 10000);
