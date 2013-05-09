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