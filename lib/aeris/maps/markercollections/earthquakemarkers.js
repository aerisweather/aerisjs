define([
  'ai/util',
  'ai/maps/markercollections/pointdatamarkers',
  'ai/api/collections/earthquakes',
  'ai/maps/markers/earthquakemarker',
  'ai/maps/markercollections/config/clusterstyles'
], function(_, PointDataMarkerCollection, EarthquakeCollection, EarthquakeMarker, clusterStyles) {
  /**
   * @publicApi
   * @class EarthquakeMarkers
   * @namespace aeris.maps.markercollections
   * @extends aeris.maps.markercollections.PointDataMarkers
   *
   * @constructor
   */
  var EarthquakeMarkerCollection = function(opt_markers, opt_options) {
    var options = _.extend({
      data: new EarthquakeCollection(),
      model: EarthquakeMarker,
      clusterStyles: clusterStyles.earthquake
    }, opt_options);

    PointDataMarkerCollection.call(this, opt_markers, options);
  };
  _.inherits(EarthquakeMarkerCollection, PointDataMarkerCollection);


  return _.expose(EarthquakeMarkerCollection, 'aeris.maps.markercollections.EarthquakeMarkers');
});
