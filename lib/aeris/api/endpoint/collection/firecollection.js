define([
  'wire!api/endpoint/config/firecontext'
], function(fireContext) {
  /**
   * A representation of fire data from the
   * Aeris API 'fires' endpoint.
   *
   * @class aeris.api.collection.FireCollection
   * @extends aeris.api.collection.PointDataCollection
   *
   * @constructor
   * @override
   */
  return fireContext.PointDataCollection;
});
