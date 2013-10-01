define(['aeris/util', 'base/layers/googlemaptype'], function(_, GoogleMapType) {
  /**
   * Representation of Google's Terrain.
   *
   * @constructor
   * @class aeris.maps.layers.GoogleTerrain
   * @extends {aeris.maps.layers.GoogleMapType}
   */
  var GoogleTerrain = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      mapTypeId: 'TERRAIN',
      name: 'GoogleTerrain'
    }, opt_attrs);


    GoogleMapType.call(this, attrs, opt_options);
  };
  _.inherits(GoogleTerrain, GoogleMapType);



  return _.expose(GoogleTerrain, 'aeris.maps.layers.GoogleTerrain');

});
