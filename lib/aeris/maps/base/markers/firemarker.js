define([
  'aeris/util',
  'base/markers/pointdatamarker'
], function(_, PointDataMarker) {
  /**
   * @class aeris.maps.markers.FireMarker
   * @extends aeris.maps.markers.PointDataMarker
   * @constructor
   */
  var FireMarker = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      url: _.config.path + 'assets/map_fire_marker.png'
    }, opt_attrs);

    PointDataMarker.call(this, attrs, opt_options);
  };
  _.inherits(FireMarker, PointDataMarker);


  return FireMarker;
});
