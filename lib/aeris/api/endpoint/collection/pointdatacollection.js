define([
  'ai/util',
  'ai/api/endpoint/collection/aerisapicollection',
  'ai/api/endpoint/model/pointdata'
], function(_, AerisApiCollection, PointData) {
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
      params: {}
    }, opt_options);

    _.defaults(options.params, {
      limit: 100,
      p: ':auto',
      radius: '3000mi'
    });

    AerisApiCollection.call(this, opt_models, options);
  };
  _.inherits(PointDataCollection, AerisApiCollection);


  return PointDataCollection;
});
