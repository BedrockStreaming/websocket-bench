(function(){

	var Monitor = function() {
		this.timer = {
			start: 0,
			stop: 0
		};

		this.results = {
			connection: 0,
			disconnection: 0,
			errors:0
		};

		this.counter = 0;
	};

	Monitor.prototype.start = function() {

		this.timer.start = Date.now();
	};

	Monitor.prototype.stop = function() {

		this.timer.stop = Date.now();
	};

	Monitor.prototype.getDuration = function() {

		return this.timer.stop - this.timer.start;
	};

	Monitor.prototype.connection = function() {
		this.results.connection++;
	};

	Monitor.prototype.disconnection = function() {
		this.results.disconnects++;
	};

	Monitor.prototype.errors = function() {
		this.results.errors++;
	};

	Monitor.prototype.merge = function(monitors) {
		for (var i = 0; i < monitors.length ; i++) {
			this.results.connection += monitors[i].results.connection;
			this.results.disconnection += monitors[i].results.disconnection;
			this.results.errors += monitors[i].results.errors;
		}

	};

	module.exports = Monitor;
})()