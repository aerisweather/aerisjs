define(['aeris/util', 'aeris/maps/layers/googlemaptype'], function(_, GoogleMapType) {
  /**
   * Representation of Google's Hybrid.
   *
   * @constructor
   * @publicApi
   * @class GoogleHybrid
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.GoogleMapType
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
