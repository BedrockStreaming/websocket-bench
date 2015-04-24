/*global require, process*/

var Benchmark = require('./lib/benchmark.js'),
  DefaultReporter = require('./lib/defaultreporter.js'),
  fs = require('fs'),
  program = require('commander'),
  logger = require('./lib/logger');

program
  .version('0.0.3')
  .usage('[options] <server>')
  .option('-a, --amount <n>', 'Total number of persistent connection, Default to 100', parseInt)
  .option('-c, --concurency <n>', 'Concurent connection per second, Default to 20', parseInt)
  .option('-w, --worker <n>', 'number of worker', parseInt)
  .option('-g, --generator <file>', 'js file for generate message or special event')
  .option('-m, --message <n>', 'number of message for a client. Default to 0', parseInt)
  .option('-o, --output <output>', 'Output file')
  .option('-t, --type <type>', 'type of websocket server to bench(socket.io, engine.io, faye, primus, wamp). Default to io')
  .option('-p, --transport <type>', 'type of transport to websocket(engine.io, websockets, browserchannel, sockjs, socket.io). Default to websockets')
  .option('-k, --keep-alive', 'Keep alive connection')
  .option('-v, --verbose', 'Verbose Logging')
  .parse(process.argv);

if (program.args.length < 1) {
  program.help();
}

var server = program.args[0];

// Set default value
if (!program.worker) {
  program.worker = 1;
}

if (!program.verbose) {
  program.verbose = false;
}

if (!program.amount) {
  program.amount = 100;
}

if (!program.concurency) {
  program.concurency = 20;
}

if (!program.generator) {
  program.generator = __dirname + '/lib/generator.js';
}

if (program.generator.indexOf('/') !== 0) {
  program.generator = process.cwd() + '/' + program.generator;
}

if (!program.message) {
  program.message = 0;
}

if (!program.type) {
  program.type = 'socket.io';
}

if (program.type === 'primus' && !program.transport) {
  program.transPort = 'websockets';
}

logger.info('Launch bench with ' + program.amount + ' total connection, ' + program.concurency + ' concurent connection');
logger.info(program.message + ' message(s) send by client');
logger.info(program.worker + ' worker(s)');
logger.info('WS server : ' + program.type);

var options = {
  generatorFile : program.generator,
  type          : program.type,
  transport     : program.transport,
  keepAlive     : program.keepAlive,
  verbose       : program.verbose
};

if (program.verbose) {
  logger.debug("Benchmark Options " + JSON.stringify(options));
}

var outputStream = null;

if (program.output) {
  if (program.generator.indexOf('/') !== 0) {
    program.output = __dirname + '/' + program.generator;
  }
  outputStream = fs.createWriteStream(program.output);
}

var reporter = new DefaultReporter(outputStream);
var bench = new Benchmark(server, reporter, options);

// On ctrl+c
process.on('SIGINT', function () {
  logger.info("\nGracefully stoping worker from SIGINT (Ctrl+C)");

  setTimeout(function () {

    if (bench.monitor.isRunning()) {
      bench.terminate();
    }

  }, 2000);

});

bench.launch(program.amount, program.concurency, program.worker, program.message, program.keepAlive);

