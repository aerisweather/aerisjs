define([
  'aeris/util',
  'aeris/config',
  'aeris/maps/markers/pointdatamarker',
  'aeris/maps/markers/config/iconlookup'
], function(_, config, PointDataMarker, iconLookup) {
  /**
   * @publicApi
   * @class aeris.maps.markers.FireMarker
   * @extends aeris.maps.markers.PointDataMarker
   * @constructor
   */
  var FireMarker = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      url: iconLookup.fire.defaultStyles.url,
      offsetX: iconLookup.fire.defaultStyles.offsetX,
      offsetY: iconLookup.fire.defaultStyles.offsetY
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
