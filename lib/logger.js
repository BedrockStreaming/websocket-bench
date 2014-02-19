/*global module, require*/

//npm
var colors = require('colors');

//Set Basic Theme
colors.setTheme({
  info  : 'green',
  debug : 'cyan',
  warn  : 'yellow',
  error : 'red'
});

/**
 * Logging Container
 * @type {{info: info, debug: debug, warn: warn, error: error}}
 */
module.exports = {

  _helpers : {
    /**
     * Stringify Object When Logging
     * @param item
     * @returns {*}
     */
    stringifyIfObj : function (item) {
      if (typeof item === 'object') {
        item = JSON.stringify(item);
      }
      return item;
    }
  },

  info : function (msg) {
    console.info(this._helpers.stringifyIfObj(msg).info);
  },

  debug : function (msg) {
    console.log(this._helpers.stringifyIfObj(msg).debug);
  },

  warn : function (msg) {
    console.warn(this._helpers.stringifyIfObj(msg).warn);
  },

  error : function (msg) {
    console.error(this._helpers.stringifyIfObj(msg).error);
  }
};
