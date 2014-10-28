define([
  'aeris/util',
  'aeris/api/collections/aerisapiclientcollection',
  'aeris/api/models/place'
], function(_, AerisApiClientCollection, Place) {
  /**
   * @publicApi
   * @class aeris.api.collections.Places
   * @extends aeris.api.collections.AerisApiClientCollection
   *
   * @constructor
  */
  var Places = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      endpoint: 'places',
      action: 'closest',
      model: Place,
      params: {}
    });

    _.defaults(options.params, {
      p: ':auto',
      limit: 100
    });

    AerisApiClientCollection.call(this, opt_models, options);
  };
  _.inherits(Places, AerisApiClientCollection);


  return _.expose(Places, 'aeris.api.collections.Places');
});
