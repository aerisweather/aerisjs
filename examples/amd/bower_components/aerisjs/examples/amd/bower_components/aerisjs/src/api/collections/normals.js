define([
  'aeris/util',
  'aeris/api/collections/aerisapiclientcollection',
  'aeris/api/models/normal'
], function(_, AerisApiClientCollection, Normal) {
  /**
   * @publicApi
   * @class Normals
   * @namespace aeris.api.collections
   * @extends aeris.api.collections.AerisApiClientCollection
   *
   * @constructor
  */
  var Normals = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      endpoint: 'normals',
      action: 'closest',
      model: Normal,
      params: {}
    });

    _.defaults(options.params, {
      p: ':auto',
      limit: 100,
      radius: '100mi'
    });

    AerisApiClientCollection.call(this, opt_models, options);
  };
  _.inherits(Normals, AerisApiClientCollection);


  return _.expose(Normals, 'aeris.api.collections.Normals');
});
