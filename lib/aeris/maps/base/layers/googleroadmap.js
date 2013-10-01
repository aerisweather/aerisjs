define(['aeris/util', 'base/layers/googlemaptype'], function(_, GoogleMapType) {
  /**
   * Representation of Google's RoadMap.
   *
   * @constructor
   * @class aeris.maps.layers.GoogleRoadMap
   * @extends {aeris.maps.layers.GoogleMapType}
   */
  var GoogleRoadMap = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      mapTypeId: 'ROADMAP',
      name: 'GoogleRoadMap'
    }, opt_attrs);

    GoogleMapType.call(this, attrs, opt_options);
  };
  _.inherits(GoogleRoadMap, GoogleMapType);


  return _.expose(GoogleRoadMap, 'aeris.maps.layers.GoogleRoadMap');
});
