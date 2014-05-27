define([
  'aeris/util',
  'aeris/maps/markercollections/pointdatamarkers',
  'aeris/api/collections/earthquakes',
  'aeris/maps/markers/earthquakemarker',
  'aeris/maps/markercollections/config/clusterstyles'
], function(_, PointDataMarkers, EarthquakeCollection, EarthquakeMarker, clusterStyles) {
  /**
   * @publicApi
   * @class EarthquakeMarkers
   * @namespace aeris.maps.markercollections
   * @extends aeris.maps.markercollections.PointDataMarkers
   *
   * @constructor
   */
  var EarthquakeMarkers = function(opt_markers, opt_options) {
    var options = _.extend({
      data: new EarthquakeCollection(),
      model: EarthquakeMarker,
      clusterStyles: clusterStyles.earthquake
    }, opt_options);

    PointDataMarkers.call(this, opt_markers, options);
  };
  _.inherits(EarthquakeMarkers, PointDataMarkers);


  return _.expose(EarthquakeMarkers, 'aeris.maps.markercollections.EarthquakeMarkers');
});
