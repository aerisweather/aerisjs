define([
  'aeris/util',
  'aeris/api/collections/aerisapiclientcollection',
  'aeris/api/models/stormcell'
], function(_, AerisApiClientCollection, StormCell) {
  /**
   * @publicApi
   * @class StormCells
   * @namespace aeris.api.collections
   * @extends aeris.api.collections.AerisApiClientCollection
   *
   * @constructor
  */
  var StormCells = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      endpoint: 'stormcells',
      action: 'closest',
      model: StormCell,
      params: {}
    });

    _.defaults(options.params, {
      p: ':auto',
      limit: 100,
      radius: '100mi'
    });

    AerisApiClientCollection.call(this, opt_models, options);
  };
  _.inherits(StormCells, AerisApiClientCollection);


  return _.expose(StormCells, 'aeris.api.collections.StormCells');
});
