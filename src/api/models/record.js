define([
  'aeris/util',
  'aeris/api/models/aerisapimodel',
  'aeris/datehelper'
], function(_, AerisApiModel, DateHelper) {
  /**
   * @publicApi
   * @class aeris.api.models.Record
   * @extends aeris.api.models.AerisApiModel
   *
   * @constructor
   * @override
   */
  var Record = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      endpoint: 'records',
      params: {}
    });

    _.defaults(options.params, {
      p: ':auto',
      limit: 100,
      radius: '100mi',
      from: new DateHelper().addDays(-60).getDate()
    });

    AerisApiModel.call(this, opt_attrs, options);
  };
  _.inherits(Record, AerisApiModel);

  return _.expose(Record, 'aeris.api.models.Record');
});
