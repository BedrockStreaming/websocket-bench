(function() {
    var Monitor = require('../monitor.js');

    var faye = require('faye');

    var FayeWorker = function(server, generator) {
        this.server = server;

        this.generator = generator;

        this.clients = [];

    };

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

    FayeWorker.prototype.launch =function(number, messageNumber) {

        var monitor = new Monitor();

        monitor.start();

        for (var i = 0; i < number ; i++) {
            this.clients.push(this.createClient(monitor, messageNumber));
        }

        var testDone = function() {

            if (monitor.counter == number && monitor.messageCounter == (monitor.results.connection * messageNumber)) {

                process.send({ action: 'done', monitor: monitor });
            } else {
                setTimeout(testDone, 500);
            }
        };

        testDone();
    };

    FayeWorker.prototype.close =function() {
        for (var i = 0; i <this.clients.length ; i++) {
            try  {
                this.clients[i].disconnect();
            } catch (err) {

            }
        }
    };

    module.exports = FayeWorker;

})();
