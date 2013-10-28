define([
  'wire!api/endpoint/config/stormreportcontext'
], function(context) {
  /**
   * A representation of storm report data from the
   * Aeris API 'stormreports' endpoint.
   *
   * @class aeris.api.collection.StormReportCollection
   * @extends aeris.api.collection.PointDataCollection
   *
   * @constructor
   * @override
   */
  return context.PointDataCollection;
});
