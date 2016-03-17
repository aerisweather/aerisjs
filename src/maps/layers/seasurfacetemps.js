define([
  'aeris/util',
  'aeris/maps/layers/aeristile'
], function(_, AerisTile) {
  /**
   * Representation of Aeris Sea Surface Temperatures layer.
   *
   * @constructor
   * @publicApi
   * @class aeris.maps.layers.SeaSurfaceTemps
   * @extends aeris.maps.layers.AerisTile
   */
  var SeaSurfaceTemps = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'SeaSurfaceTemps',
      tileType: 'modis-sst'
    }, opt_attrs);

    AerisTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisTile
  _.inherits(SeaSurfaceTemps, AerisTile);


  return _.expose(SeaSurfaceTemps, 'aeris.maps.layers.SeaSurfaceTemps');
});
