define([
  'aeris/util',
  'aeris/api/models/aerisapimodel'
], function(_, AerisApiModel) {
  /**
   * @publicApi
   * @class Sunmoon
   * @namespace aeris.api.models
   * @extends aeris.api.models.AerisApiModel
   *
   * @constructor
   * @override
   */
  var Sunmoon = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      endpoint: 'sunmoon',
      params: {}
    });

    _.defaults(options.params, {
      p: ':auto'
    });

    AerisApiModel.call(this, opt_attrs, options);
  };
  _.inherits(Sunmoon, AerisApiModel);

  return _.expose(Sunmoon, 'aeris.api.models.Sunmoon');
});
