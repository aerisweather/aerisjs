define([
  'ai/util',
  'ai/maps/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @publicApi
   * @class Humidity
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var Humidity = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'Humidity',
      tileType: 'current_rh',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.CURRENT
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(Humidity, AerisInteractiveTile);


  return _.expose(Humidity, 'aeris.maps.layers.Humidity');
});
