define([
  'aeris/util',
  'aeris/api/collections/aerisapicollection',
  'aeris/api/models/pointdata'
], function(_, AerisApiCollection, PointData) {
  /**
   * A representation of point data from the Aeris Api.
   *
   * @class PointDataCollection
   * @namespace aeris.api.collections
   * @extends aeris.api.collections.AerisApiCollection
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
