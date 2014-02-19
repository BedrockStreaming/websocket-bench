/*global describe, it, require*/

  var mocha = require('mocha'),
    chai = require('chai'),
    should = chai.should();

  var logger = require('../../lib/logger.js');

  describe('logger', function () {

    describe('#info', function () {
      it('Should be a callable method', function () {
        should.exist(logger.info);
      });
    });

    describe('#debug', function () {
      it('Should be a callable method', function () {
        should.exist(logger.debug);
      });
    });

    describe('#warn', function () {
      it('Should be a callable method', function () {
        should.exist(logger.warn);
      });
    });

    describe('#error', function () {
      it('Should be a callable method', function () {
        should.exist(logger.error);
      });
    });

    describe('#stringifyIfObj', function () {
      it('Should be a "_helpers" method', function () {
        should.exist(logger._helpers.stringifyIfObj);
      });

      it('Should return a string', function () {
        var string1 = "This is a Test";
        var stringTest = logger._helpers.stringifyIfObj(string1);
        stringTest.should.equal(string1);
      });

      it('Should return a JSON.stringified string', function () {
        var obj1 = {"foo" : "bar"};
        var objTest = logger._helpers.stringifyIfObj(obj1);
        objTest.should.equal(JSON.stringify(obj1));
      });
    });
  });
