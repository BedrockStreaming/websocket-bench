var mocha = require('mocha'),
  chai = require('chai'),
  should = chai.should(),
  sinon = require('sinon'),
  assert = chai.assert,
  io = require('socket.io');

var Benchmark = require('../../lib/benchmark.js');

var port = 3337;
var benchmark = null,
  testReporter;

var server = null;

// describe('Test IO Benchmarking', function() {

//     beforeEach(function() {
//         testReporter = {
//             report: function() {}
//         };

//         benchmark  = new Benchmark('http://localhost:3337', testReporter, {
//             type: 'socket.io'
//         });
//     });

//     describe('Test with a io server working' , function() {

//         before(function(done) {
//             server = io.listen(port);
//             server.set('log level', 0);
//             setTimeout(function() {
//                 done();
//             }, 1500);
//         });

//         after(function() {
//             server.server.close();
//         });

//         it('should connect 10 client server', function(done) {

//             var connectNumber = 0;
//             server.on('connection', function (socket) {
//                 connectNumber++;
//                 if (connectNumber == 10) {

//                     benchmark.close();
//                     done();
//                 };
//             });

//             benchmark.launch(10, 10, 1, 0);
//         });

//         it('should connect call reporter with 2 connection done', function(done) {

//             this.timeout(3000);


//             var stubReport = sinon.stub(testReporter, 'report', function(steps, monitor) {
//                 assert.equal(monitor.results.connection, 2);
//                 assert.equal(monitor.results.errors, 0);
//                 testReporter.report.restore();

//                 benchmark.close();
//                 done();
//             });

//             benchmark.launch(2, 1, 1, 0);
//         });

//     });

//     describe('Test without server' , function() {

//         it('should connect call reporter with 10 errors', function(done) {

//             var stubReport = sinon.stub(testReporter, 'report', function(steps, monitor) {
//                 assert.equal(monitor.results.connection, 0);
//                 assert.equal(monitor.results.errors, 10);
//                 testReporter.report.restore();

//                 benchmark.close();
//                 done();
//             });

//             benchmark.launch(10, 10, 1, 0);
//         });
//     });

// });
