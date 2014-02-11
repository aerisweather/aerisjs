define([
  'ai/util',
  'ai/api/endpoint/collections/pointdatacollection',
  'ai/api/endpoint/models/lightning'
], function(_, PointDataCollection, Lightning) {
  /**
   * A representation of lighting data from the
   * Aeris API 'lightning' endpoint.
   *
   * @publicApi
   * @class LightningCollection
   * @namespace aeris.api.collections
   * @extends aeris.api.collections.PointDataCollection
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
