define([
  'ai/util',
  'ai/maps/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @publicApi
   * @class Temps
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var Temps = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'Temps',
      tileType: 'current_temps',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.CURRENT
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(Temps, AerisInteractiveTile);


  return _.expose(Temps, 'aeris.maps.layers.Temps');
});
