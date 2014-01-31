define([
  'ai/util',
  'ai/api/endpoint/collection/pointdatacollection',
  'ai/api/endpoint/model/lightning'
], function(_, PointDataCollection, Lightning) {
  /**
   * A representation of lighting data from the
   * Aeris API 'lightning' endpoint.
   *
   * @publicApi
   * @class aeris.api.collection.LightningCollection
   * @extends aeris.api.collection.PointDataCollection
   *
   * @constructor
   * @override
   */
  var LightningCollection = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      params: {
        limit: 200
      },
      model: Lightning,
      endpoint: 'lightning',
      action: 'within'
    });

    PointDataCollection.call(this, opt_models, options);
  };
  _.inherits(LightningCollection, PointDataCollection)


  return _.expose(LightningCollection, 'aeris.api.LightningCollection');
});
