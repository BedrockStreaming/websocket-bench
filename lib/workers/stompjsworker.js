/* global module, require*/
const SockJS = require('sockjs-client');
const Stomp = require('stompjs');
const util = require('util');
const BaseWorker = require('./baseworker.js');
const logger = require('../logger.js');

/**
 * StompjsWorker Worker class inherits form BaseWorker
 */
const StompjsWorker = function(server, generator) {
  StompjsWorker.super_.apply(this, arguments);
};

util.inherits(StompjsWorker, BaseWorker);

StompjsWorker.prototype.createClient = function(callback) {
  var self = this;
  const socket = new SockJS(this.server);
  const stompClient = Stomp.over(socket);
  stompClient.connect(
    {},
    function(frame) {
      callback(false, stompClient);
    },
    err => {
      if (self.verbose) {
        logger.error('StompJS Worker connect_failed' + JSON.stringify(err));
      }
      callback(true, stompClient);
    }
  );
};

module.exports = StompjsWorker;
