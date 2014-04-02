define([
  'aeris/util',
  'googlemaps!',
  'aeris/maps/strategy/layers/layerstrategy'
], function(_, gmaps, LayerStrategy) {
  /**
   * A strategy for rendering a GoogleMapType layers with OpenLayers.
   *
   * @constructor
   * @class GoogleMapTypeStrategy
   * @namespace aeris.maps.openlayers.layers
   * @extends aeris.maps.openlayers.layers.LayerStrategy
   */
  var GoogleMapTypeStrategy = function(layer) {
    /**
     * @override
     * @property isBaseLayer_
     */
    this.isBaseLayer_ = _.isUndefined(this.isBaseLayer_) ? true : this.isBaseLayer_;

    LayerStrategy.call(this, layer);
  };
  _.inherits(GoogleMapTypeStrategy, LayerStrategy);


  /**
   * @method createView_
   */
  GoogleMapTypeStrategy.prototype.createView_ = function() {
    return new OpenLayers.Layer.Google(this.object_.get('name'), {
      type: gmaps.MapTypeId[this.object_.get('mapTypeId')]
    });
  };


  return GoogleMapTypeStrategy;
});
