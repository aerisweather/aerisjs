define([
  'aeris/util',
  'aeris/errors/invalidconfigerror',
  'aeris/builder/options/appbuilderoptions',
  'base/layers/googleroadmap',
  'base/abstractlayer'
], function(_, InvalidConfigError, BaseOptions, GoogleRoadMap, LayerInteface) {
  /**
   * @typedef {AppBuilderOptions} MapAppBuilderOptions
   *
   * @property {HTMLElement}      el
   *                              Element where the application
   *                              should be inserted.
   *
   * @property {Object=}          map
   *                              Map options.
   *
   * @property {Function}         onload
   *                              This callback is passed the active
   *                              {aeris.maps.Map} object as the
   *                              first argument.
   *
   * @property {aeris.maps.layers.GoogleMapType}
   *                              map.baseLayer
   *                              Base layer constructor.
   *                              Defaults to {aeris.maps.layers.GoogleRoadMap}.
   *
   * @property {number=}          map.zoom
   *                              Zoom level of map. Default is 12.
   *
   * @property {Array.<number>=}  map.center
   *                              LatLon coordinates on which to center the map.
   *
   * @property {Boolean=}         map.scrollZoom
   *                              Whether to allow map zooming
   *                              with the mouse scroll wheel.
   *                              Default is true.
   *
   * @property {Array.<aeris.maps.AbstractLayer>=} layers
   *                              An array of layers to display on the map.
   *                              Provide the class constructor for the layer.
   *                              eg. [aeris.maps.layers.AerisRadar]
   *
   * @property {Boolean=}         autoAnimate
   *                              If true, layer animations will begin as soon
   *                              as the app loads.
   *
   * @property {Object=|Boolean=} controls
   *                              Options for UI controls to interact with the map.
   *                              Setting this property to false will prevent controls
   *                              from being rendered.
   *
   * @property {Boolean=}         controls.layers
   *                              Set to true to display layer controls
   *
   * @property {Boolean=}         controls.animation
   *                              Set to true to display animation controls
   */

  /**
   * @constructor
   * @class aeris.builder.options.MapAppBuilderOptions
   * @extends aeris.builder.options.AppBuilderOptions
   *
   * @param {MapAppBuilderOptions=} opt_options
   */
  var MapAppBuilderOptions = function(opt_options) {
    BaseOptions.call(this, opt_options);
  };

  _.inherits(MapAppBuilderOptions, BaseOptions);


  /**
   * @override
   */
  MapAppBuilderOptions.prototype.getDefaultOptions = function() {
    var baseOptions = BaseOptions.prototype.getDefaultOptions.call(this);

    return _.extend(baseOptions, {
      map: {
        zoom: 12,
        center: [44.98, -93.2636],
        scrollZoom: true,
        baseLayer: GoogleRoadMap
      },
      layers: [],
      autoAnimate: false,
      controls: {
        layers: false,
        animation: false
      }
    });
  };


  /**
   * @override
   */
  MapAppBuilderOptions.prototype.normalizeOptions_ = function(options) {
    var layerDefault;

    options.controls || (options.controls = {});

    // Default to visible if layer controls off
    layerVisibleDefault = !options.controls.layers;

    // Normalize layers
    if (options.layers) {
      _.each(options.layers, function(layer, i) {
        var type = layer.type || layer;

        // Convert layer from string to ctor
        type = this.nameToLayer_(type);

        // Normalize options as an object
        options.layers[i] = {
          type: type,
          default: _.isUndefined(layer.default) ? layerVisibleDefault : layer.default
        };
      }, this);
    }

    // Normalize base map layer
    if (options.map && options.map.baseLayer) {
      options.map.baseLayer = this.nameToLayer_(options.map.baseLayer);
    }


    // Turn on all controls
    if (options.controls === 'true') {
      options.controls = {
        layers: true,
        animation: true
      }
    }

    return options;
  };


  /**
   * Converts a named layer into a
   * reference to a layer constructor.
   *
   * @throws {aeris.errors.InvalidConfigError} If no layer matches the specified name
   *                                           or the named layer is not loaded.
   * @param {string|Object} name
   * @return {aeris.maps.AbstractLayer} Layer constructor.
   * @private
   */
  MapAppBuilderOptions.prototype.nameToLayer_ = function(name) {
    var layerCtor;


    if (_.isString(name)) {
      try {
        layerCtor = aeris.maps.layers[name];
      } catch(e) {}
    }
    // Assume name is already a constructor
    else if (_.isFunction(name)) {
      layerCtor = name;
    }

    // Check that the layer type exists
    if (_.isUndefined(layerCtor)) {
      throw new InvalidConfigError('Unable to build map application: ' +
        'Layer \'' + name + '\' does not exist, or has not been loaded');
    }

    return layerCtor;
  };


  return MapAppBuilderOptions;
});
