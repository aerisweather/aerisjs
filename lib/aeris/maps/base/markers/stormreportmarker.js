define([
  'aeris/util',
  'aeris/config',
  'base/markers/pointdatamarker',
  'base/markers/config/iconlookup'
], function(_, config, PointDataMarker, iconLookup) {
  /**
   * @class aeris.maps.markers.StormReportMarker
   * @extends aeris.maps.markers.PointDataMarker
   * @constructor
   */
  var StormReportMarker = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      url: config.get('path') + 'assets/marker_yellow.png'
    }, opt_attrs);

    var options = _.extend({
      iconLookup: iconLookup.stormReport,
      typeAttribute: 'stormtypes'
    }, opt_options);

    PointDataMarker.call(this, attrs, options);
  };
  _.inherits(StormReportMarker, PointDataMarker);


  return StormReportMarker;
});
