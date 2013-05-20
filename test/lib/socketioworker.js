(function() {
    var mocha = require('mocha'),
        chai = require('chai'),
        assert = chai.assert,
        should = chai.should(),
        io = require('socket.io-client');

    var SocketIOWorker = require('../../lib/workers/socketioworker.js'),
        BaseWorker = require('../../lib/workers/baseworker.js'),
        Monitor = require('../../lib/monitor.js');

    describe('SocketIOWorker', function() {

        describe('#constructor' , function() {

            it('Should be an instance of base worker', function() {
                var worker = new SocketIOWorker('server', {});

                worker.should.be.instanceof(BaseWorker);
            });

        });

        describe('#createClient' , function() {

            it('create a socket.io client', function(done) {
                var worker = new SocketIOWorker('server', {});
                worker.createClient(function(err, client) {
                    client.should.be.instanceof(io.SocketNamespace);
                    done();
                });



            });

        });

    });

})();
