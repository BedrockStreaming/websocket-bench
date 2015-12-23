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
    var client = new WebsocketClient('ws://localhost:8080/');

    client.onopen = function (){
        callback(false, client);
    };
    client.onerror = function(err){
        if (self.verbose) {
            logger.error("SocketIO Worker error: " + JSON.stringify(err));
        }
        callback(true,client);
    };

    client.onmessage = function(e) {
        if(self.verbose){
            logger.error("REceived: " + JSON.stringify(err));
        }
    };
    //client.on('message')


}

module.exports = WebsocketWorker;

