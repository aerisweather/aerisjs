define([
  'aeris/util',
  'aeris/maps/layers/aeristile'
], function(_, AerisTile) {
  /**
   * Representation of Aeris Lightning Strike Density layer.
   *
   * @constructor
   * @publicApi
   * @class LightningStrikeDensity
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisTile
   */
  var LightningStrikeDensity = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'Lightning Strike Density',
      tileType: 'ltngsd',
      autoUpdateInterval: AerisTile.updateIntervals.SATELLITE
    }, opt_attrs);


    AerisTile.call(this, attrs, opt_options);
  };
  _.inherits(LightningStrikeDensity, AerisTile);




  return _.expose(LightningStrikeDensity, 'aeris.maps.layers.LightningStrikeDensity');

});
