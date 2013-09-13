define([
  'aeris/loader/abstractloader',
  'aeris/maps/loader',
  'aeris/promise',
  'vendor/underscore'
], function(AbstractLoader, MapsLoader, Promise, _) {
  /**
   * Aeris Loader
   * Loads scripts from the Aeris Library.
   *
   * @static
   * @class aeris.Loader
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
    var reqs = [];

    var addReq = function(path) {
      if (reqs.indexOf(path) === -1) {
        reqs.push(path);
      }
    };

    config = _.extend({
      onload: function() {},
      onerror: function() {}
    }, config);

    if (config.maps) {
      promises.push(MapsLoader.load(config));
    }

    if (config.RouteAppBuilder) {
      addReq('aeris/builder/route/routeappbuilder');
    }

    if (config.MapAppBuilder) {
      addReq('aeris/builder/maps/mapappbuilder');

      // Require layers specified in configuration
      if (config.MapAppBuilder.layers) {
        for (var i = 0; i < config.MapAppBuilder.layers.length; i++) {
          var layer = config.MapAppBuilder.layers[i];

          // Layer can be a string, or an object
          layer = layer.type || layer;

          // Require layer path
          if (toString.call(layer) === '[object String]') {
            addReq('base/layers/' + layer.toLowerCase());
          }
        }
      }

      // Require base map layers
      addReq('base/layers/' + config.MapAppBuilder.map.baseLayer.toLowerCase());
    }

    promises.push(this.loadReqs_(reqs));

    return Promise.when(promises).
      done(_.partial(Loader.runBuilders_, config)).
      done(config.onload).
      fail(config.onerror);
  };

  Loader.runBuilders_ = function(config) {
    var routeAppBuilder;

    if (config.RouteAppBuilder) {
      routeAppBuilder = new aeris.RouteAppBuilder(config.RouteAppBuilder);
      routeAppBuilder.build();
    }

    if (config.MapAppBuilder) {
      var mapAppBuilder = new aeris.MapAppBuilder(config.MapAppBuilder);
      mapAppBuilder.build();
    }
  };


  return Loader;
});
