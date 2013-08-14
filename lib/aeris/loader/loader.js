define([
  'aeris/loader/abstractloader',
  'aeris/maps/loader',
  'aeris/promise',
  'aeris/utils'
], function(AbstractLoader, MapsLoader, Promise, _) {
  /**
   * Aeris Loader
   * Loads scripts from the Aeris Library.
   *
   * @static
   * @class Loader
   * @extends {AbstractLoader}
   */
  var Loader = {};
  _.extend(Loader, AbstractLoader);

  /**
   * @override
   *
   * @param {Object} config
   *
   * @param {Object} config.maps
   * @param {Array.<string>} config.maps.layers
   * @param {Array.<string>} config.maps.components
   * @param {Array.<string>} config.maps.events
   *
   * @param {Function} config.onload
   * @param {Function} config.onerror
   *
   * @return {aeris.Promise} A promise to load all scripts.
   */
  Loader.load = function(config) {
    var promises = [];

    config = _.extend({
      onload: function() {},
      onerror: function() {}
    }, config);

    if (config.maps) {
      promises.push(MapsLoader.load(config));
    }

    return Promise.when(promises).
      done(config.onload).
      fail(config.onerror);
  };

  return Loader;
});
