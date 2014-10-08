define([
  'aeris/util',
  'aeris/api/collections/pointdatacollection',
  'aeris/api/collections/aerisapiclientcollection',
  'aeris/api/models/lightning'
], function(_, PointDataCollection, AerisApiClientCollection, Lightning) {
  /**
   * A representation of lighting data from the
   * Aeris API 'lightning' endpoint.
   *
   * @publicApi
   * @class Lightning
   * @namespace aeris.api.collections
   * @extends aeris.api.collections.PointDataCollection
   *
   * @constructor
   * @override
   */
  var Lightning = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      params: {
        limit: 200
      },
      model: Lightning,
      endpoint: 'lightning',
      action: 'within',
      SourceCollectionType: PointDataCollection
    });

    AerisApiClientCollection.call(this, opt_models, options);
  };
  _.inherits(Lightning, AerisApiClientCollection);


  return _.expose(Lightning, 'aeris.api.collections.Lightning');
});
