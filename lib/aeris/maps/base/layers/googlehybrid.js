define(['aeris/util', 'base/layers/googlemaptype'], function(_, GoogleMapType) {
  /**
   * Representation of Google's Hybrid.
   *
   * @constructor
   * @class aeris.maps.layers.GoogleHybrid
   * @extends {aeris.maps.layers.GoogleMapType}
   */
  var GoogleHybrid = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      mapTypeId: 'HYBRID',
      name: 'GoogleHybrid'
    }, opt_attrs);


    GoogleMapType.call(this, attrs, opt_options);
  };
  _.inherits(GoogleHybrid, GoogleMapType);


  return _.expose(GoogleHybrid, 'aeris.maps.layers.GoogleHybrid');

});
