(function() {

	var Monitor = require('../monitor.js');

	var BaseWorker = function(server, generator) {
        this.server = server;

        this.generator = generator;

        this.clients = [];
    };

	BaseWorker.prototype.launch =function(number, messageNumber) {

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

    BaseWorker.prototype.close =function() {
		for (var i = 0; i <this.clients.length ; i++) {
			try  {
				this.clients[i].disconnect();
			} catch (err) {

			}
		}
	};

    module.exports =BaseWorker;

})();