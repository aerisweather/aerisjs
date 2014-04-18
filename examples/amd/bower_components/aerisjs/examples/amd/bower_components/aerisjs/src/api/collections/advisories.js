define([
  'aeris/util',
  'aeris/api/collections/aerisapiclientcollection',
  'aeris/api/models/advisory'
], function(_, AerisApiClientCollection, Advisory) {
  /**
   * @publicApi
   * @class Advisories
   * @namespace aeris.api.collections
   * @extends aeris.api.collections.AerisApiClientCollection
   *
   * @constructor
  */
  var Advisories = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      endpoint: 'advisories',
      action: 'closest',
      model: Advisory,
      params: {}
    });

    _.defaults(options.params, {
      p: ':auto',
      limit: 100,
      radius: '1000mi'
    });

    AerisApiClientCollection.call(this, opt_models, options);
  };
  _.inherits(Advisories, AerisApiClientCollection);


  return _.expose(Advisories, 'aeris.api.collections.Advisories');
});
