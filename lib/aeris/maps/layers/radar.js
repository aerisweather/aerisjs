define([
  'ai/util',
  'ai/maps/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * Representation of Aeris Radar layer.
   *
   * @constructor
   * @publicApi
   * @class Radar
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var Radar = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'Radar',
      tileType: 'radar',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.RADAR,
      zIndex: 505
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };
  _.inherits(Radar, AerisInteractiveTile);




  return _.expose(Radar, 'aeris.maps.layers.Radar');

});
