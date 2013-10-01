define([
  'aeris/util',
  'base/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @class aeris.maps.layers.AerisAdvisories
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var AerisAdvisories = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'AerisAdvisories',
      tileType: 'alerts',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.ADVISORIES
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(AerisAdvisories, AerisInteractiveTile);


  return _.expose(AerisAdvisories, 'aeris.maps.layers.AerisAdvisories');
});
