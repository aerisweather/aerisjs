define([
  'aeris/util',
  'aeris/config',
  'aeris/maps/markers/pointdatamarker'
], function(_, config, PointDataMarker) {
  /**
   * @publicApi
   * @class FireMarker
   * @namespace aeris.maps.markers
   * @extends aeris.maps.markers.PointDataMarker
   * @constructor
   */
  var FireMarker = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      url: config.get('assetPath') + 'map_fire_marker.png'
    }, opt_attrs);

    PointDataMarker.call(this, attrs, opt_options);
  };
  _.inherits(FireMarker, PointDataMarker);


  /**
   * @method lookupTitle_
   */
  FireMarker.prototype.lookupTitle_ = function() {
    var cause = this.getDataAttribute('report.cause');

    return cause ? 'Fire caused by ' + cause : 'Fire';
  };


  return _.expose(FireMarker, 'aeris.maps.markers.FireMarker');
});
