(function() {


    var faye = require('faye'),
        util = require('util'),
        BaseWorker = require('./baseworker.js');

    var FayeWorker =  function(server, generator) {

        FayeWorker.super_.apply(this, arguments);
    };

    util.inherits(FayeWorker, BaseWorker);

    FayeWorker.prototype.createClient =function(monitor, messageNumber) {

        var _this = this;

        var client = new faye.Client(this.server);

        if (_this.generator.beforeConnect) {
            _this.generator.beforeConnect(client);
        }

        client.bind('transport:down', function() {
            monitor.errors();
        });

        client.bind('transport:up', function() {
            _this.generator.onConnect(client, function(err) {

                if(err) {
                    monitor.errors();
                } else {
                    monitor.connection();

                    for (var i = 0; i < messageNumber; i++) {
                        _this.generator.sendMessage(client, function(err) {
                            if(err) {
                                monitor.msgFailed();
                            } else {
                                monitor.msgSend();
                            }
                        });
                    }
                }

            });
        });
        client.connect();

        return client;
    };

    module.exports = FayeWorker;

})();
