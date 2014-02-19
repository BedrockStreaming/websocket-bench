(function () {

  var logger = require('./logger'),
    server = process.argv[2],
    generatorFile = process.argv[3],
    workerType = process.argv[4],
    verbose = process.argv[6] === 'true',
    Worker;

  if (!generatorFile || generatorFile == 'undefined') {
    generatorFile = './generator.js';
  }

  var generator = require(generatorFile);

  switch (workerType) {
    case 'socket.io':
      Worker = require('./workers/socketioworker.js');
      break;
    case 'faye':
      Worker = require('./workers/fayeworker.js');
      break;
    case 'primus':
      Worker = require('./workers/primusworker.js');
      break;
    default:
      logger.error('error workerType ' + workerType);
  }

  var worker = new Worker(server, generator, verbose);

  process.on('message', function (message) {

    if (message.msg == 'close') {
      worker.close();

      process.exit();
    }

    if (message.msg == 'run') {
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

})();

