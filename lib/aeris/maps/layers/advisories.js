define([
  'ai/util',
  'ai/maps/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @publicApi
   * @class Advisories
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var Advisories = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'Advisories',
      tileType: 'alerts',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.ADVISORIES
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(Advisories, AerisInteractiveTile);


  return _.expose(Advisories, 'aeris.maps.layers.Advisories');
});
