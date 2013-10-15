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
        apiSecret: config.apiSecret
      });

      // Add the map object
      this.addPath_('base/map');

      // Split out all module config options
      // from other options.
      modules = _.omit(config,
        'onload',
        'onerror',
        'mapType',
        'apiId',
        'apiSecret'
      );

      // Add individual modules
      _.each(modules, function(modItems, modName) {
        // Use base dir for all but the packages
        var prefix = modName === 'packages' ? '' : 'base/';

        this.addPathAt_(modItems, prefix + modName);
      }, this);

      // Load 'er up
      // and proxy the promise over.
      this.loadPaths_().
        done(promise.resolve, promise).
        fail(promise.reject, promise);
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
