define([
  'aeris/util',
  'ai/maps/markercollections/pointdatamarkercollection',
  'ai/api/endpoint/collection/earthquakecollection',
  'ai/maps/markers/earthquakemarker',
  'ai/maps/markercollections/config/clusterstyles'
], function(_, PointDataMarkerCollection, EarthquakeCollection, EarthquakeMarker, clusterStyles) {
  /**
   * @class aeris.maps.EarthquakeMarkers
   * @extends aeris.maps.markercollections.PointDataMarkerCollection
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


  return _.expose(EarthquakeMarkerCollection, 'aeris.maps.EarthquakeMarkers');
});
