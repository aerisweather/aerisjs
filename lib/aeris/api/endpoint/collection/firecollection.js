define([
  'aeris/util',
  'api/endpoint/collection/pointdatacollection',
  'api/endpoint/model/fire'
], function(_, PointDataCollection, Fire) {
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
  var FireCollection = function(opt_models, opt_options) {
    var options = _.extend({
      model: Fire,
      endpoint: 'fires',
      action: 'search',
      params: {
        limit: 500,
        query: 'type:L'
      }
    }, opt_options);

    PointDataCollection.call(this, opt_models, options);
  };
  _.inherits(FireCollection, PointDataCollection);


  return FireCollection;
});
