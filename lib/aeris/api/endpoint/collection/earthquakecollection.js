define([
  'wire!api/endpoint/config/earthquakecontext'
], function(context) {
  /**
   * A representation of earthquake data from the
   * Aeris API 'earthquakes' endpoint.
   *
   * @class aeris.api.collection.EarthquakeCollection
   * @extends aeris.api.collection.PointDataCollection
   *
   * @constructor
   * @override
   */
  return context.PointDataCollection;
});
