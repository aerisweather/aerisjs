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
      bounds: [52.37, -135.52, 22.43, -55.016]   // A rough box around the US
    }, opt_options);

    // Normalize params as Model
    options.params = (options.params instanceof Params) ?
      options.params : new Params(options.params);

    // Set default params
    options.params.set({
      limit: options.params.get('limit') || 100,
      p: options.params.get('bounds') || options.bounds
    });

    AerisApiCollection.call(this, opt_models, options);
  };
  _.inherits(PointDataCollection, AerisApiCollection);


  return PointDataCollection;
});
