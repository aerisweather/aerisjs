define([
  'aeris/util',
  'api/endpoint/collection/aerisapicollection',
  'api/endpoint/model/pointdata',
  'api/params/model/params'
], function(_, AerisApiCollection, PointData, Params) {
  /**
   * A representation of point data from the Aeris Api.
   *
   * @class aeris.api.collection.PointDataCollection
   * @extends aeris.api.collection.AerisApiCollection
   *
   * @constructor
   * @override
   */
  var PointDataCollection = function(opt_models, opt_options) {
    var options = _.extend({
      validate: true,
      model: PointData,
      params: {
        bounds: [52.37, -135.52, 22.43, -55.016],   // A rough box around the US
        limit: 100,
        p: [52.37, -135.52, 22.43, -55.016]   // A rough box around the US
      }
    }, opt_options);

    AerisApiCollection.call(this, opt_models, options);
  };
  _.inherits(PointDataCollection, AerisApiCollection);


  return PointDataCollection;
});
