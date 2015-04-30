/*global module, require, process*/

var logger = require('./logger'),
  server = process.argv[2],
  generatorFile = process.argv[3],
  workerType = process.argv[4],
  verbose = process.argv[6] === 'true';

if (!generatorFile || generatorFile === 'undefined') {
  generatorFile = './generator.js';
}

var generator = require(generatorFile);
var BenchmarkWorker = null;

switch (workerType) {
  case 'socket.io':
    BenchmarkWorker = require('./workers/socketioworker.js');
    break;
  case 'engine.io':
	Worker = require('./workers/engineioworker.js');
	break;
  case 'faye':
    BenchmarkWorker = require('./workers/fayeworker.js');
    break;
  case 'primus':
    BenchmarkWorker = require('./workers/primusworker.js');
    break;
  case 'wamp':
    BenchmarkWorker = require('./workers/wampworker.js');
    break;
  default:
    logger.error('error workerType ' + workerType);
}

var worker = new BenchmarkWorker(server, generator, verbose);

process.on('message', function (message) {
  if (message.msg === 'close') {
    worker.close();
    process.exit();
  }

  if (message.msg === 'run') {
    worker.launch(message.number, message.nbMessage);
  }
});

// On ctrl+c
process.on('SIGINT', function () {
  worker.close();
  setTimeout(function () {
    process.exit();
  }, 3000);
});

