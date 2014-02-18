define([
  'aeris/util',
  'aeris/maps/layers/aeristile'
], function(_, AerisTile) {
  /**
   * @constructor
   * @publicApi
   * @class Advisories
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisTile
   */
  var Advisories = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'Advisories',
      tileType: 'alerts',
      autoUpdateInterval: AerisTile.updateIntervals.ADVISORIES
    }, opt_attrs);


    AerisTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisTile
  _.inherits(Advisories, AerisTile);


  return _.expose(Advisories, 'aeris.maps.layers.Advisories');
});
