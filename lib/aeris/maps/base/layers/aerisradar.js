define([
  'aeris/util',
  'base/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * Representation of Aeris Radar layer.
   *
   * @constructor
   * @class aeris.maps.layers.AerisRadar
   * @extends {aeris.maps.layers.AerisInteractiveTile}
   */
  var AerisRadar = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'AerisRadar',
      tileType: 'radar',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.RADAR,
      zIndex: 505
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };
  _.inherits(AerisRadar, AerisInteractiveTile);




  return _.expose(AerisRadar, 'aeris.maps.layers.AerisRadar');

});
