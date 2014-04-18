define([
  'aeris/util',
  'aeris/api/collections/aerisapiclientcollection',
  'aeris/api/models/record',
  'aeris/datehelper'
], function(_, AerisApiClientCollection, Record, DateHelper) {
  /**
   * @publicApi
   * @class Records
   * @namespace aeris.api.collections
   * @extends aeris.api.collections.AerisApiClientCollection
   *
   * @constructor
   */
  var Records = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      endpoint: 'records',
      action: 'closest',
      model: Record,
      params: {}
    });

    _.defaults(options.params, {
      p: ':auto',
      limit: 100,
      radius: '100mi',
      from: new DateHelper().addDays(-60)
    });

    AerisApiClientCollection.call(this, opt_models, options);
  };
  _.inherits(Records, AerisApiClientCollection);


  return _.expose(Records, 'aeris.api.collections.Records');
});
