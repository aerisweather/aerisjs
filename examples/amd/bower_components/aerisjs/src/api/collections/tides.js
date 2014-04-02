define([
  'aeris/util',
  'aeris/api/collections/aerisapiclientcollection',
  'aeris/api/models/tide'
], function(_, AerisApiClientCollection, Tide) {
  /**
   * @publicApi
   * @class Tides
   * @namespace aeris.api.collections
   * @extends aeris.api.collections.AerisApiClientCollection
   *
   * @constructor
  */
  var Tides = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      endpoint: 'tides',
      action: 'closest',
      model: Tide,
      params: {}
    });

    _.defaults(options.params, {
      p: ':auto',
      limit: 100,
      radius: '100mi'
    });

    AerisApiClientCollection.call(this, opt_models, options);
  };
  _.inherits(Tides, AerisApiClientCollection);


  return _.expose(Tides, 'aeris.api.collections.Tides');
});
