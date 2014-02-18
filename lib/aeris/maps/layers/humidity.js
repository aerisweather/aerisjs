define([
  'aeris/util',
  'aeris/maps/layers/aeristile'
], function(_, AerisTile) {
  /**
   * @constructor
   * @publicApi
   * @class Humidity
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisTile
   */
  var Humidity = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'Humidity',
      tileType: 'current_rh',
      autoUpdateInterval: AerisTile.updateIntervals.CURRENT
    }, opt_attrs);


    AerisTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisTile
  _.inherits(Humidity, AerisTile);


  return _.expose(Humidity, 'aeris.maps.layers.Humidity');
});
