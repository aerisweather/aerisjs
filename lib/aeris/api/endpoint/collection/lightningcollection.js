define([
  'wire!api/endpoint/config/lightningcontext'
], function(lightningContext) {
  /**
   * A representation of lightning data from the
   * Aeris API 'lightning' endpoint.
   *
   * @class aeris.api.collection.LightningCollection
   * @extends aeris.api.collection.PointDataCollection
   *
   * @constructor
   * @override
   */
  return lightningContext.PointDataCollection;
});
