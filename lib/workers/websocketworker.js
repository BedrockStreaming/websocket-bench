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

    client.onmessage = function(msg) {
        if(self.verbose){
            var data = JSON.parse(msg.data)
            logger.error("Received: " + data);
        }
    };
    //client.on('message')


}

module.exports = WebsocketWorker;

