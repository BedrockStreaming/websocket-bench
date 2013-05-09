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

	Monitor.prototype.merge = function(monitor) {
			this.results.connection += monitor.results.connection;
			this.results.disconnection += monitor.results.disconnection;
			this.results.errors += monitor.results.errors;
			this.counter += monitor.counter;

	};

	module.exports = Monitor;
})()