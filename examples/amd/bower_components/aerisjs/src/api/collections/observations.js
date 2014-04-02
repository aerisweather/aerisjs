define([
  'aeris/util',
  'aeris/api/collections/aerisapiclientcollection',
  'aeris/api/models/observation'
], function(_, AerisApiClientCollection, Observation) {
  /**
   * @publicApi
   * @class Observations
   * @namespace aeris.api.collections
   * @extends aeris.api.collections.AerisApiClientCollection
   *
   * @constructor
  */
  var Observations = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      endpoint: 'observations',
      action: 'closest',
      model: Observation,
      params: {}
    });

    _.defaults(options.params, {
      p: ':auto',
      limit: 100,
      radius: '1000mi'
    });

    AerisApiClientCollection.call(this, opt_models, options);
  };
  _.inherits(Observations, AerisApiClientCollection);


  return _.expose(Observations, 'aeris.api.collections.Observations');
});
