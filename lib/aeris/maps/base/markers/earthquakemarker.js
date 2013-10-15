define([
  'aeris/util',
  'aeris/config',
  'base/markers/pointdatamarker'
], function(_, config, PointDataMarker) {
  /**
   * @class aeris.maps.markers.EarthquakeMarker
   * @extends aeris.maps.markers.PointDataMarker
   * @constructor
   */
  var EarthquakeMarker = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      url: config.get('path') + 'assets/quake_minor.png'
    }, opt_attrs);

    var options = _.extend({
      iconLookup: {
        mini: 'quake_mini',
        minor: 'quake_minor',
        light: 'quake_light',
        moderate: 'quake_moderate',
        strong: 'quake_strong',
        major: 'quake_major',
        great: 'quake_great',
        shallow: 'quake_mini'
      },
      iconTypeAttribute: 'report.type'
    }, opt_options);


    PointDataMarker.call(this, attrs, options);

  };
  _.inherits(EarthquakeMarker, PointDataMarker);


  return EarthquakeMarker;
});
