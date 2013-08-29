define([
  'aeris/util',
  'aeris/builder/options/appbuilderoptions',
  'base/layers/googleroadmap'
], function(_, BaseOptions, GoogleRoadMap) {
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
   * @property {Array.<aeris.maps.Layer>=} layers
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
    options.layerControls || (options.layerControls = {});

    // Normalize layers
    if (options.layers) {
      _.each(options.layers, function(layer, i) {
        var type = layer.type || layer;
        options.layers[i] = {
          type: type,
          default: _.isUndefined(layer.default) ? false : layer.default
        };
      });
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


  return MapAppBuilderOptions;
});
