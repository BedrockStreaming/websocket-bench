/*global module, require*/

var Monitor = require('../monitor.js'),
  logger = require('../logger.js');


/**
 * BaseWorker constructor
 * @param {server}    server
 * @param {generator} generator
 * @param {verbose} verbose logging
 */
var BaseWorker = function (server, generator, verbose) {
  this.server = server;
  this.generator = generator;
  this.clients = [];
  this.running = true;
  this.verbose = verbose;
};

/**
 * launch client creation and message
 * @param {number}    number
 * @param {messageNumber} messageNumber
 */
BaseWorker.prototype.launch = function (number, messageNumber) {
  var _this = this;
  var monitor = new Monitor();

  for (var i = 0; i < number; i++) {
    this.createClient(function (err, client) {
      _this.clients.push(client);
      _this._onClientCreation(client, monitor, messageNumber, err);
    });
  }

  var testDone = function () {
    if (!_this._testLaunchDone(monitor, number, messageNumber)) {
      setTimeout(testDone, 500);
    }
  };

  testDone();
};

BaseWorker.prototype.createClient = function (callback) {
  logger.error('Not implement method create client');
};

/**
 * Close Method (must be redifined if client doesnt have a disconnect method)
 */
BaseWorker.prototype.close = function () {
  this.running = false;

  for (var i = 0; i < this.clients.length; i++) {
    try { this.clients[i].disconnect(); } catch (err) { }
  }
};

/**
 * _onClientCreation internal method
 * @api private
 */
BaseWorker.prototype._onClientCreation = function (client, monitor, messageNumber, err) {
  var _this = this;

  if (err) {
    monitor.errors();
  } else {

    _this.generator.onConnect(client, function (err) {

      if (err) {
        monitor.errors();
      } else {
        monitor.connection();

        // Send Messages
        for (var msgSend = 0; msgSend < messageNumber; msgSend++) {
          _this.generator.sendMessage(client, function (err) {
            _this._onMessageSend(monitor, err);

          });
        }
      }
    });
  }
};

/**
 * _onMessageSend internal method
 * @api private
 */
BaseWorker.prototype._onMessageSend = function (monitor, err) {
  if (err) {
    monitor.msgFailed();
  } else {
    monitor.msgSend();
  }
};

/**
 * _testLaunchDone internal method
 * @api private
 */
BaseWorker.prototype._testLaunchDone = function (monitor, number, messageNumber) {
  if (monitor.counter === number && monitor.messageCounter === (monitor.results.connection * messageNumber)) {

    process.send({ action : 'done', monitor : monitor });

    return true;
  }

  return false;
};

module.exports = BaseWorker;
