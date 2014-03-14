define([
  'aeris/util',
  'aeris/config',
  'aeris/maps/markers/pointdatamarker',
  'aeris/maps/markers/config/iconlookup'
], function(_, config, PointDataMarker, iconLookup) {
  /**
   * @publicApi
   * @class EarthquakeMarker
   * @namespace aeris.maps.markers
   * @extends aeris.maps.markers.PointDataMarker
   * @constructor
   */
  var EarthquakeMarker = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      url: config.get('assetPath') + 'quake_minor.png'
    }, opt_attrs);

    var options = _.extend({
      iconLookup: iconLookup.earthquake,
      typeAttribute: 'report.type'
    }, opt_options);


    PointDataMarker.call(this, attrs, options);

  };
  _.inherits(EarthquakeMarker, PointDataMarker);


  /**
   * @override
   * @method lookupTitle_
   * @protected
   */
  EarthquakeMarker.prototype.lookupTitle_ = function() {
    var mag = this.getDataAttribute('report.mag').toFixed(1);
    return _.isUndefined(mag) ? 'Earthquake' :
      'Magnitute ' + mag + ' Earthquake.';
  };


  return _.expose(EarthquakeMarker, 'aeris.maps.markers.EarthquakeMarker');
});
