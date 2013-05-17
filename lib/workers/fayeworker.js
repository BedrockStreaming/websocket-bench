(function() {


    var faye = require('faye'),
        util = require('util'),
        BaseWorker = require('./baseworker.js');

    /**
    * Faye Worker class inherits form BaseWorker
    */
    var FayeWorker =  function(server, generator) {

        FayeWorker.super_.apply(this, arguments);
    };

    util.inherits(FayeWorker, BaseWorker);

    FayeWorker.prototype.createClient =function(callback) {

        var _this = this;

        var client = new faye.Client(this.server);

        if (_this.generator.beforeConnect) {
            _this.generator.beforeConnect(client);
        }

        client.bind('transport:down', function() {
            callback(true);
        });

        client.bind('transport:up', function() {
            callback();
        });

        client.connect();

        return client;
    };

    module.exports = FayeWorker;

})();
