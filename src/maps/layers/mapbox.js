define([
  'aeris/util',
  'aeris/maps/layers/layer',
  'aeris/maps/strategy/layers/mapbox'
], function(_, Layer, MapBoxStrategy) {
  /**
   * @class aeris.maps.layers.MapBox
   * @extends aeris.maps.layers.Layer
   *
   * @constructor
   */
  var MapBox = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      strategy: MapBoxStrategy
    });

    Layer.call(this, opt_attrs, options);
  };
  _.inherits(MapBox, Layer);


  return _.expose(MapBox, 'aeris.maps.layers.MapBox');
});
