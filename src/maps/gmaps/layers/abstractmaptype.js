define([
  'aeris/util',
  'aeris/maps/strategy/abstractstrategy'
], function(_, AbstractStrategy) {
  /**
   * Base class for layer strategies
   * interacting with the {google.maps.MapType} interface.
   *
   * @override
   * @constructor
   * @class aeris.maps.gmaps.layers.AbstractMapTypeStrategy
   * @extends aeris.maps.gmaps.AbstractStrategy
   */
  var AbstractMapTypeStrategy = function(layer) {
    /**
     * @override
     * @property view_
     * @type {google.maps.MapType}
     */

    /**
     * The previous map type id.
     * @type {google.maps.MapTypeId}
     * @property prevMapTypeId_
     */
    this.prevMapTypeId_;

    /**
     * The google.maps.MapTypeId for this layer.
     *
     * @type {string}
     * @default The layer's `name` property
     * @protected
     * @property mapTypeId_
     */
    this.mapTypeId_ = this.mapTypeId_ ||
                      layer.get('mapTypeId') ||
                      layer.get('name');


    /**
     * Whether the layer should
     * be treated as a Base Map Type
     * @type {Boolean}
     * @default false
     * @property isBaseLayer_
     */
    this.isBaseLayer_ = _.isUndefined(this.isBaseLayer_) ? false : this.isBaseLayer_;


    AbstractStrategy.apply(this, arguments);
  };

  _.inherits(AbstractMapTypeStrategy, AbstractStrategy);


  /**
   * @override
   * @abstract
   * @return {google.maps.MapType}
   */
  AbstractMapTypeStrategy.prototype.createView_;


  /**
   * @method setMap
   */
  AbstractMapTypeStrategy.prototype.setMap = function(aerisMap, opt_options) {
    var options = _.extend({
      baseLayer: this.isBaseLayer_
    }, opt_options);

    AbstractStrategy.prototype.setMap.call(this, aerisMap, options);

    // Store the previous map type
    // in case we want to revert
    this.prevMapTypeId_ = this.mapView_.mapTypeId;

    this.registerMapType_();

    if (options.baseLayer) {
      // Set as a base layer
     this.mapView_.setMapTypeId(this.mapTypeId_);
      this.isBaseLayer_ = true;
    }
    else {
      // Set as an overlay layer
      this.mapView_.overlayMapTypes.push(this.getView());
      this.isBaseLayer_ = false;
    }

    this.delegateMapEvents_();
  };


  /**
   * Add the map type to the
   * map's google.maps.MapTypeRegistry
   *
   * @private
   * @method registerMapType_
   */
  AbstractMapTypeStrategy.prototype.registerMapType_ = function() {
    if (!this.mapView_) {
      throw new InvalidArgumentError('Cannot register map type: ' +
        this.getView() + ': no map is associated with this layer view');
    }

    // Add the map type to the map's registry
    this.mapView_.mapTypes.set(this.mapTypeId_, this.getView());
  };


  /**
   * @method beforeRemove_
   */
  AbstractMapTypeStrategy.prototype.beforeRemove_ = function() {

    // Base Layer --> Revert to the last map type
    if (this.isBaseLayer_) {
      if (this.prevMapTypeId_) {
        this.mapView_.setMapTypeId(this.prevMapTypeId_);
      }
    }
    // Overlay --> Remove Overlay from map
    else {
      var overlayMapTypes = this.mapView_.overlayMapTypes.getArray();
      var viewToRemove = _.find(overlayMapTypes, function(mapType) {
        return mapType === this.getView();
      }, this);
      var index = overlayMapTypes.indexOf(viewToRemove);

      this.mapView_.overlayMapTypes.removeAt(index);
    }

    this.undelegateMapEvents_();
  };


  /**
   * Bind events to the map view.
   * This is a good place to proxy events
   * over to your MapExtensionObject.
   *
   * @private
   * @method delegateMapEvents_
   */
  AbstractMapTypeStrategy.prototype.delegateMapEvents_ = function() {
  };


  /**
   * Remove event bindings
   * from the map view.
   *
   * @private
   * @method undelegateMapEvents_
   */
  AbstractMapTypeStrategy.prototype.undelegateMapEvents_ = function() {
    this.googleEvents_.stopListening(this.mapView_);
  };


  return AbstractMapTypeStrategy;
});
