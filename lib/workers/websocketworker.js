/*global module, require*/
var WebsocketClient       = require('websocket').w3cwebsocket,
    util       = require('util'),
    BaseWorker = require('./baseworker.js'),
    logger     = require('../logger.js');

var WebsocketWorker = function(server, generator){
    WebsocketWorker.super_.apply(this,arguments);
}

util.inherits(WebsocketWorker, BaseWorker);

WebsocketWorker.prototype.createClient = function (callback) {
    var self = this;
    var client = new WebsocketClient(this.server);

    client.onopen = function (){
        callback(false, client);
    };
    client.onerror = function(err){
        if (self.verbose) {
            logger.error("Websocket Worker error: " + JSON.parse(err));
        }
        callback(true,client);
    };
}

WebsocketWorker.prototype.close =function () {
    this.running = false;

    for (var i = 0; i < this.clients.length; i++) {
        try { this.clients[i].close(); } catch (err) {}
    }
};

module.exports = WebsocketWorker;

