define([
  'aeris/loader/abstractloader',
  'aeris/util',
  'aeris/config',
  'aeris/promise',
  'aeris/errors/invalidconfigerror'
], function(AbstractLoader, _, aerisConfig, Promise, InvalidConfigError) {
  /**
   * Loads scripts from the Aeris Maps Library
   *
   * @class aeris.maps.Loader
   * @extends aeris.loader.AbstractLoader
   */
  var MapsLoader = function() {
    AbstractLoader.apply(this, arguments);
  };
  _.inherits(MapsLoader, AbstractLoader);

  /**
   * @override
   *
   * @param {Object} config
   *        In addition to described options,
   *        you may include lists of individual modules to
   *        load. For example:
   *          layers: ['AerisRadar','AerisSatellite']
   *        Available module types include:
   *        - layers
   *        - markercollections.
   *
   * @param {Array.<string>} config.packages
   *        Named packages to load.
   *        Available packages include:
   *        - animations
   *        - infobox
   *        - layers
   *        - maps
   *        - markers
   *        - route.
   *
   * @param {string} config.mapType
   *        Map rendering library to use. Current options are
   *        'gmaps', or 'openlayers'.
   *
   * @return {aeris.Promise}
   */
  MapsLoader.prototype.load = function(config) {
    var modules;
    var promise = new Promise();

    try {
      config = this.normalizeConfig_(config);

      // Set map type strategy
      this.setStrategy_(config.mapType);

      // Set api config
      if (!config.apiId || !config.apiSecret) {
        throw new InvalidConfigError('Aeris Maps Loader requires an apiId and apiSecret for the Aeris API');
      }
      aerisConfig.set({
        apiId: config.apiId,
        apiSecret: config.apiSecret,
        path: config.path
      });

      // Split out all module config options
      // from other options.
      modules = _.omit(config,
        'onload',
        'onerror',
        'mapType',
        'apiId',
        'apiSecret',
        'path',
        'packages'
      );

      // Load packages first
      // Then load the rest of the modules
      // This will prevent modules from double-loading
      // dependencies that have already be bundled into packages.
      this.addPathAt_(config.packages, 'packages');
      this.addPath_('base/map');
      this.loadPaths_().
        fail(promise.reject, promise).
        done(function() {
          // Add individual modules
          _.each(modules, function(modItems, modName) {
            this.addPathAt_(modItems, 'base/' + modName);
          }, this);

          // Load 'er up
          // and proxy the promise over.
          this.loadPaths_().
            done(promise.resolve, promise).
            fail(promise.reject, promise);
        }, this);

    }
    catch (e) {
      // Reject promise with any errors
      promise.reject({
        code: e.name,
        message: e.message
      });
    }

    return promise.
      done(config.onload, null).
      fail(config.onerror, null);
  };

  /**
   * Maps the strategy path
   * to a specified path within aeris/maps/.
   *
   * @param {string} strategy
   * @protected
   */
  MapsLoader.prototype.setStrategy_ = function(strategy) {
    if (['gmaps', 'openlayers'].indexOf(strategy) === -1) {
      throw new InvalidConfigError('Invalid mapType. Valid mapType ' +
        'options are \'gmaps\' or \'openlayers\'');
    }

    require.config({
      map: {
        '*': {
          'strategy': 'aeris/maps/' + strategy
        }
      }
    });
  };


  return MapsLoader;
});
