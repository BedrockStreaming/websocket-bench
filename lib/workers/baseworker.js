(function() {

	var Monitor = require('../monitor.js');

    /**
    * BaseWorker constructor
    * @param {server}    server
    * @param {generator} generator
    */
	var BaseWorker = function(server, generator) {
        this.server = server;

        this.generator = generator;

        this.clients = [];
    };

    /**
    * launch client creation and message
    * @param {number}    number
    * @param {generator} generator
    */
	BaseWorker.prototype.launch = function(number, messageNumber) {

        var _this = this;

        var monitor = new Monitor();

        monitor.start();

        for (var i = 0; i < number ; i++) {

            var client = this.createClient(function(err) {
                _this._onClientCreation(client, monitor, messageNumber, err);
            });

            this.clients.push(client);
        }

        var _this = this;

        var testDone = function() {
            if (!_this._testLaunchDone(monitor, number, messageNumber)) {
                setTimeout(testDone, 500);
            }
        };

        testDone();
    };

    BaseWorker.prototype.createClient = function(callback) {

        console.log('Not implement method create client');
    };

    /**
    * Close Method (must be redifined if client doesnt have a disconnect method)
    */
    BaseWorker.prototype.close =function() {
		for (var i = 0; i <this.clients.length ; i++) {
			try  { this.clients[i].disconnect(); } catch (err) { }
		}
	};

    /**
    * _onClientCreation internal method
    * @api private
    */
    BaseWorker.prototype._onClientCreation = function(client, monitor, messageNumber, err) {

        var _this = this;

        if (err) {
            monitor.errors();
        } else {

            _this.generator.onConnect(client, function(err) {

                if(err) {
                    monitor.errors();
                } else {
                    monitor.connection();

                    // Send Messages
                    for (var msgSend = 0; msgSend < messageNumber; msgSend ++) {
                        _this.generator.sendMessage(client, function(err) {
                            _this._onMessageSend(monitor, err);

                        });
                    }
                }
            });
        }
    }

    /**
    * _onMessageSend internal method
    * @api private
    */
    BaseWorker.prototype._onMessageSend = function(monitor, err) {

        if (err) {
            monitor.msgFailed();
        } else {
            monitor.msgSend();
        }
    }

    /**
    * _testLaunchDone internal method
    * @api private
    */
    BaseWorker.prototype._testLaunchDone = function(monitor, number, messageNumber) {
        if (monitor.counter == number && monitor.messageCounter == (monitor.results.connection * messageNumber)) {

                monitor.stop();
                process.send({ action: 'done', monitor: monitor });

                return true;
        }

        return false;
    }

    module.exports =BaseWorker;

})();
