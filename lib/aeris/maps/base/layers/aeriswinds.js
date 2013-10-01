define([
  'aeris/util',
  'base/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @class aeris.maps.layers.AerisWinds
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var AerisWinds = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'AerisWinds',
      tileType: 'current_winds',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.CURRENT
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(AerisWinds, AerisInteractiveTile);


  return _.expose(AerisWinds, 'aeris.maps.layers.AerisWinds');
});
