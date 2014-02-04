(function(module) {
  var _ = require('underscore');

  function filterPublicClasses(classes) {
    return _.filter(classes, function(cls) {
      return cls.hasOwnProperty('publicApi');
    });
  }

  var helpers = {

    eachPublicClass: function(classes, options) {
    },

    /**
     * Log the object to the console.
     * Call {{{log this}}} to log entire page context.
     *
     * Note: must escape helper (ie. use triple brackets).
     *
     * @param {Object} obj
     * @return {string}
     */
    log: function(obj) {
      return '<script type="text/javascript">' +
        'console.log(' + JSON.stringify(obj) + ');' +
        '</script>'
    }
  };

  module.exports = helpers;
}(module));