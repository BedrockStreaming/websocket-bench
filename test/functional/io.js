(function() {
    var mocha = require('mocha'),
        chai = require('chai'),
        should = chai.should(),
        sinon  = require('sinon'),
        assert = chai.assert,
        io = require('socket.io');

    var Benchmark = require('../../lib/benchmark.js');

    var port = 3337;
    var benchmark = null,
        testReporter;

    var server = null;

    describe('Test IO Benchmarking', function() {

        beforeEach(function() {
            testReporter = {
                report: function() {}
            };

            benchmark  = new Benchmark('http://localhost:3337', testReporter, {
                type: 'socket.io'
            });
        });

        describe('Test with a io server working' , function() {

            before(function() {
                server = io.listen(port);
                server.set('log level', 0);
            });
            after(function() {
                server.server.close();
            });

            it('should connect 10 client server', function(done) {

                var connectNumber = 0;
                server.on('connection', function (socket) {
                    connectNumber++;
                    if (connectNumber == 10) {

                        done();
                    };
                });

                benchmark.launch(10, 10, 1, 0);
            });

            it('should connect call reporter with 5 connection done', function(done) {

                var stubReport = sinon.stub(testReporter, 'report', function(steps, monitor) {
                    assert.equal(monitor.results.connection, 5);
                    assert.equal(monitor.results.errors, 0);
                    testReporter.report.restore();

                    done();
                });

                benchmark.launch(5, 5, 2, 0);
            });
        });
        describe('Test without server' , function() {

            it('should connect call reporter with 10 errors', function(done) {

                var stubReport = sinon.stub(testReporter, 'report', function(steps, monitor) {
                    assert.equal(monitor.results.connection, 0);
                    assert.equal(monitor.results.errors, 10);
                    testReporter.report.restore();

                    done();
                });

                benchmark.launch(10, 10, 1, 0);
            });
        });

    });
should
})();
