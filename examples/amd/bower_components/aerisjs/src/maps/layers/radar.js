define([
  'aeris/util',
  'aeris/maps/layers/aeristile'
], function(_, AerisTile) {
  /**
   * Representation of Aeris Radar layer.
   *
   * @constructor
   * @publicApi
   * @class Radar
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisTile
   */
  var Radar = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'Radar',
      tileType: 'radar',
      autoUpdateInterval: AerisTile.updateIntervals.RADAR,
      zIndex: 505
    }, opt_attrs);


    AerisTile.call(this, attrs, opt_options);
  };
  _.inherits(Radar, AerisTile);




  return _.expose(Radar, 'aeris.maps.layers.Radar');

});
