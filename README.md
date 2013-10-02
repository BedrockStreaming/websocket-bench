# websocket bench

Nodejs cli tool for benchmark web socket server, currently support (socket.io, faye)

[![Build Status](https://travis-ci.org/M6Web/websocket-bench.png?branch=master)](https://travis-ci.org/M6Web/websocket-bench)


## Installation

	npm install -g websocket-bench

## Usage

set ulimit for your system ulimit -n 60000

Simple example

`websocket-bench -a 2500 -c 200 http://localhost:3000`


command help

	  Usage: websocket-bench [options] <server>

	  Options:

	    -h, --help              output usage information
	    -V, --version           output the version number
	    -a, --amount <n>        Total number of persistent connection, Default to 100
	    -c, --concurency <n>    Concurent connection per second, Default to 20
	    -w, --worker <n>        number of worker
	    -g, --generator <file>  js file for generate message or special event
	    -m, --message <n>       number of message for a client. Default to 0
	    -t, --type <type>       type of websocket server to bench(socket.io, faye). Default to io


## Benchmark message

For benchmark message or more advanced connection you should provide your own `generator`

generator structure :

	(function() {


		/**
		* Before connection (just for faye)
		* @param {client} client connection
		*/
		exports.beforeConnect = function(client) {
			// Your logic
			// By example
			// client.setHeader('Authorization', 'OAuth abcd-1234');
			// client.disable('websocket');
		};


		/**
		* on client connect
		* @param {client} client connection
		* @param {done}   callback function(err) {}
		*/
		exports.onConnect = function(client, done) {
			// Your logic
			
                        // Faye client
			//client.subscribe('/channel', function(message) { });
			
                        //Socket.io client
                        //client.emit('test', { hello: 'world' });

			done();
		};

		/**
		* send a message
		* @param {client} client connection
		* @param {done}   callback function(err) {}
		*/
		exports.sendMessage = function(client, done) {
			// Your logic
			//client.emit('test', { hello: 'world' });
			//client.publish('/test', { hello: 'world' });
			done();
		};

	})();


## See also 

French article about websocket-bench : [Benchmarking websockets avec Node.Js](http://tech.m6web.fr/benchmarking-websockets-avec-nodejs)

