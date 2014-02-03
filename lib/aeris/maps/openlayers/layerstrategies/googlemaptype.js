define([
  'ai/util',
  'googlemaps!',
  'ai/maps/strategy/layerstrategies/abstractlayerstrategy'
], function(_, gmaps, AbstractLayerStrategy) {
  /**
   * A strategy for rendering a GoogleMapType layers with OpenLayers.
   *
   * @constructor
   * @class GoogleMapTypeStrategy
   * @namespace aeris.maps.openlayers.layerstrategies
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
    return new OpenLayers.Layer.Google(this.object_.get('name'), {
      type: gmaps.MapTypeId[this.object_.get('mapTypeId')]
    });
  };


  return GoogleMapTypeStrategy;
});
