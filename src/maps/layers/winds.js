define([
  'aeris/util',
  'aeris/maps/layers/aeristile'
], function(_, AerisTile) {
  /**
   * @constructor
   * @publicApi
   * @class Winds
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisTile
   */
  var Winds = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'Winds',
      tileType: 'current_winds',
      autoUpdateInterval: AerisTile.updateIntervals.CURRENT
    }, opt_attrs);


    AerisTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisTile
  _.inherits(Winds, AerisTile);


  return _.expose(Winds, 'aeris.maps.layers.Winds');
});
