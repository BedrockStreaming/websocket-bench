# Socket.io bench

nodejs cli tool for benchmark socket.io server

## Usage

example

`node index.js -a 2500 -c 200 http://localhost:3000`


command help

	Usage: index.js [options] <server>

	  Options:

	    -h, --help              output usage information
	    -V, --version           output the version number
	    -a, --amount <n>        Total number of persistent connection, Default to 100
	    -c, --concurency <n>    Concurent connection per second, Default to 20
	    -w, --worker <n>        number of worker
	    -g, --generator <file>  js file for generate message or special event
	    -m, --message <n>       number of message for a client. Default to 0

## Benchmark message

For benchmark message you should provide your own `generator`

generator structure :

	(function() {

		/**
		* on socket io connect
		* @param {socket} socket io connection
		* @param {done}   callback function(err) {}
		*/
		exports.onConnect = function(socket, done) {
			// Your logic

			done();
		};

		/**
		* send a message
		* @param {socket} socket io connection
		* @param {done}   callback function(err) {}
		*/
		exports.sendMessage = function(socket, done) {
			// Your logic
			//socket.emit('test', { hello: 'world' });
			done();
		};

	})();



