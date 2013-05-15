(function() {
	var mocha = require('mocha'),
		chai = require('chai'),
		assert = chai.assert,
		faye = require('faye');

	var FayeWorker = require('../lib/workers/fayeworker.js'),
		BaseWorker = require('../lib/workers/baseworker.js');

	describe('FayeWorker', function() {

		describe('#constructor' , function() {

			it('Should be an instance of base worker', function() {
				var worker = new FayeWorker('server', {});

				assert(worker instanceof BaseWorker);
			});

		});

		describe('#createClient' , function() {

			it('Should be an instance of base worker', function() {
				var worker = new FayeWorker('server', {});
				var client = worker.createClient();

				assert(client instanceof faye.Client);
			});

		});

	});

})();