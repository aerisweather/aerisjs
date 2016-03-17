define([
  'aeris/util',
  'aeris/maps/layers/aeristile'
], function(_, AerisTile) {
  /**
   * Representation of Aeris Sea Surface Temperatures layer.
   *
   * @constructor
   * @publicApi
   * @class aeris.maps.layers.Chlorophyll
   * @extends aeris.maps.layers.AerisTile
   */
  var Chlorophyll = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'Chlorophyll',
      tileType: 'modis-chlo'
    }, opt_attrs);

    AerisTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisTile
  _.inherits(Chlorophyll, AerisTile);


  return _.expose(Chlorophyll, 'aeris.maps.layers.Chlorophyll');
});
