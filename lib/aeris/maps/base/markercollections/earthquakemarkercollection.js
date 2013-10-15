define([
  'aeris/util',
  'base/markercollections/pointdatamarkercollection',
  'api/endpoint/collection/earthquakecollection',
  'base/markers/earthquakemarker'
], function(_, PointDataMarkerCollection, EarthquakeCollection, EarthquakeMarker) {
  /**
   * @class aeris.maps.EarthquakeMarkers
   * @extends aeris.maps.markercollections.PointDataMarkerCollection
   *
   * @constructor
   */
  var EarthquakeMarkerCollection = function(opt_markers, opt_options) {
    var options = _.extend({
      data: new EarthquakeCollection(),
      marker: EarthquakeMarker
    }, opt_options);

    PointDataMarkerCollection.call(this, opt_markers, options);
  };
  _.inherits(EarthquakeMarkerCollection, PointDataMarkerCollection);


  return _.expose(EarthquakeMarkerCollection, 'aeris.maps.EarthquakeMarkers');
});
