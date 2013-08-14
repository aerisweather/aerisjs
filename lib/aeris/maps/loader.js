define([
  'aeris/loader/abstractloader',
  'aeris/utils'
], function(AbstractLoader, _) {
  /**
   * Loads scripts from the Aeris Maps Library
   *
   * @class
   * @static
   * @extends {AbstractLoader}
   */
  var MapsLoader = {};
  _.extend(MapsLoader, AbstractLoader);

  /**
   * @override
   *
   * @param {Object} config
   *
   * @param {Object} config
   * @param {Array.<string>} config.layers
   * @param {Array.<string>} config.components
   * @param {Array.<string>} config.events
   *
   * @param {Function} config.onload
   * @param {Function} config.onerror
   */
  MapsLoader.load = function(config) {
    var reqs = [];

    config = _.extend({
      type: 'google',
      layers: [],
      components: [],
      events: [],
      onload: function() {},
      onerror: function() {}
    }, config);

    // Load map
    if (config.type === 'google') {
      reqs.push('gmaps/map');
    }
    else if (config.type === 'openlayers') {
      reqs.push('openlayers/map');
    }

    // Load components
    _.each(config.components, function(component) {
      reqs.push('aeris/maps/packages/' + component);
    });

    // Load layers
    _.each(config.layers, function(layer) {
      reqs.push('base/layers/' + layer);
    });

    // Load events
    _.each(config.events, function(event) {
      reqs.push('base/events/' + event);
    });

    return MapsLoader.loadReqs_(reqs).
      done(onload).
      fail(onerror);
  };

  return MapsLoader;
});
