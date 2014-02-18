define([
  'aeris/util',
  'aeris/errors/invalidargumenterror',
  'aeris/maps/strategy/layers/abstractmaptype',
  'googlemaps!'
], function(_, InvalidArgumentError, BaseLayerStrategy, gmaps) {
  /**
   * Strategy for basic map types
   * (roadmap, satellite, terrain, hybrid)
   *
   * @override
   * @class GoogleMapType
   * @namespace aeris.maps.gmaps.layers
   * @extends aeris.maps.layers.LayerStrategy
   * @constructor
   */
  var GoogleMapTypeStrategy = function(layer) {
    /**
     * @override
     * @property mapTypeId_
     */
    this.mapTypeId_ = gmaps.MapTypeId[layer.get('mapTypeId')];


    /**
     * @override
     * @property isBaseLayer_
     */
    this.isBaseLayer_ = true;

    BaseLayerStrategy.call(this, layer);
  };

  _.inherits(GoogleMapTypeStrategy, BaseLayerStrategy);


  GoogleMapTypeStrategy.prototype.createView_ = function() {
    // Do nothing -- view is created by google maps
    return;
  };


  /**
   * Note that google only provide
   * access to the {google.maps.MapType} instance
   * of basic map types via the {google.maps.Map}'s
   * {google.maps.MapRegistry}.
   *
   * @override
   * @method getView
   */
  GoogleMapTypeStrategy.prototype.getView = function() {
    var view;

    if (this.mapView_) {
      view = this.mapView_.mapTypes.get(this.mapTypeId_);
    }

    if (!view) {
      throw new Error('Unable to return MapType view. ' +
        'Basic Google MapTypes must be set to a map' +
        'before they can provide a view');
    }

    return view;
  };


  /**
   * @override
   * @throws {aeris.errors.InvalidArgumentError}
   *        If attempting to set a GoogleMapType as an
   *        overlay layer.
   * @method setMap
   */
  GoogleMapTypeStrategy.prototype.setMap = function(aerisMap, opt_options) {
    var options = _.extend({
      baseLayer: this.isBaseLayer_
    }, opt_options);

    if (!options.baseLayer) {
      throw new InvalidArgumentError('Basic Google MapTypes cannot ' +
        'be set as overlay map types');
    }

    BaseLayerStrategy.prototype.setMap.apply(this, arguments);
  };


  GoogleMapTypeStrategy.prototype.registerMapType_ = function() {
    // Do nothing -- basic map types are already registered.
    return;
  };


  return GoogleMapTypeStrategy;
});
