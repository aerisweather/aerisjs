define([
  'ai/util',
  'ai/maps/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @publicApi
   * @class Winds
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var Winds = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'Winds',
      tileType: 'current_winds',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.CURRENT
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(Winds, AerisInteractiveTile);


  return _.expose(Winds, 'aeris.maps.layers.Winds');
});
