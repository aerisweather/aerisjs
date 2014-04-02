define([
  'aeris/util',
  'aeris/api/collections/pointdatacollection',
  'aeris/api/collections/aerisapiclientcollection',
  'aeris/api/models/fire'
], function(_, PointDataCollection, AerisApiClientCollection, Fire) {
  /**
   * A representation of fire data from the
   * Aeris API 'fires' endpoint.
   *
   * @publicApi
   * @class Fires
   * @namespace aeris.api.collections
   * @extends aeris.api.collections.PointDataCollection
   *
   * @constructor
   * @override
   */
  var Fires = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      params: {
        limit: 500,
        query: [{
          property: 'type',
          value: 'L'
        }]
      },
      model: Fire,
      endpoint: 'fires',
      action: 'search',
      SourceCollectionType: PointDataCollection
    });

    AerisApiClientCollection.call(this, opt_models, options);
  };
  _.inherits(Fires, AerisApiClientCollection);


  return _.expose(Fires, 'aeris.api.collections.Fires');
});
