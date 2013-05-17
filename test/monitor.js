(function() {
    var mocha = require('mocha'),
        chai = require('chai'),
        should = chai.should(),
        assert = chai.assert;

    var Monitor = require('../lib/monitor.js');

    describe('Monitor', function() {

        describe('#constructor' , function() {

            it('Timer must be equal to 0', function() {
                var monitor = new Monitor();

                monitor.timer.start.should.equal(0);
                monitor.timer.stop.should.equal(0);
            });

        });

        describe('#getDuration', function() {

            it('If monitor not started and not stoped must return null', function() {
                var monitor = new Monitor();

                should.not.exist(monitor.getDuration());
            });

            it('If monitor not started must return null', function() {
                var monitor = new Monitor();

                monitor.stop();

                should.not.exist(monitor.getDuration());
            });

            it('If monitor not stoped must return null', function() {
                var monitor = new Monitor();

                monitor.start();

                should.not.exist(monitor.getDuration());

            });

            it('If monitor started and then stoped must return a positive value', function() {

                var monitor = new Monitor();

                monitor.start();

                monitor.stop();

                assert.isNumber(monitor.getDuration());

            });

        });

    });

})();
