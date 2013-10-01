define([
  'aeris/util',
  'strategy/layerstrategies/abstractlayerstrategy'
], function(_, AbstractLayerStrategy) {
  /**
   * A strategy for rendering a GoogleMapType layers with OpenLayers.
   *
   * @constructor
   * @class aeris.maps.openlayers.layerstrategies.GoogleMapTypeStrategy
   * @extends aeris.maps.openlayers.layerstrategies.AbstractLayerStrategy
   */
  var GoogleMapTypeStrategy = function(layer) {
    /**
     * @override
     */
    this.isBaseLayer_ = _.isUndefined(this.isBaseLayer_) ? true : this.isBaseLayer_;

    AbstractLayerStrategy.call(this, layer);
  };
  _.inherits(GoogleMapTypeStrategy, AbstractLayerStrategy);


  /**
   * @override
   */
  GoogleMapTypeStrategy.prototype.createView_ = function() {
    return new OpenLayers.Layer.Google(this.layer_.get('name'), {
      type: google.maps.MapTypeId[this.layer_.get('mapTypeId')]
    });
  };


  return GoogleMapTypeStrategy;
});
