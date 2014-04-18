define([
  'aeris/util',
  'aeris/config',
  'aeris/maps/markers/pointdatamarker',
  'aeris/maps/markers/config/iconlookup'
], function(_, config, PointDataMarker, iconLookup) {
  /**
   * @publicApi
   * @class StormReportMarker
   * @namespace aeris.maps.markers
   * @extends aeris.maps.markers.PointDataMarker
   * @constructor
   */
  var StormReportMarker = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      url: config.get('assetPath') + 'marker_yellow.png'
    }, opt_attrs);

    var options = _.extend({
      iconLookup: iconLookup.stormReport,
      typeAttribute: 'stormtypes'
    }, opt_options);

    PointDataMarker.call(this, attrs, options);
  };
  _.inherits(StormReportMarker, PointDataMarker);


  /**
   * @override
   * @method lookupTitle_
   * @protected
   */
  StormReportMarker.prototype.lookupTitle_ = function() {
    var type = this.getDataAttribute('report.type');
    var name = this.getDataAttribute('report.name');

    // Capitalize type
    type = type.charAt(0).toUpperCase() + type.slice(1);

    return (type && name) ? type + ': ' + name :
      'Storm report';
  };


  return _.expose(StormReportMarker, 'aeris.maps.markers.StormReportMarker');
});
