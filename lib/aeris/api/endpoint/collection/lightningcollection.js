define([
  'aeris/util',
  'api/endpoint/collection/pointdatacollection',
  'api/endpoint/model/lightning'
], function(_, PointDataCollection, Lightning) {
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
  var LightningCollection = function(opt_models, opt_options) {
    var options = _.extend({
      model: Lightning,
      endpoint: 'lightning',
      action: 'within',
      params: {
        limit: 200
      }
    }, opt_options);

    PointDataCollection.call(this, opt_models, options);
  };
  _.inherits(LightningCollection, PointDataCollection);


  return LightningCollection;
});
