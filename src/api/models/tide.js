define([
  'aeris/util',
  'aeris/api/models/aerisapimodel'
], function(_, AerisApiModel) {
  /**
   * @publicApi
   * @class Tide
   * @namespace aeris.api.model
   * @extends aeris.api.endpoint.model.AerisApiModel
   *
   * @constructor
   * @override
   */
  var Tide = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      endpoint: 'tides',
      params: {}
    });

    _.defaults(options.params, {
      p: ':auto',
      limit: 100,
      radius: '100mi'
    });

    AerisApiModel.call(this, opt_attrs, options);
  };
  _.inherits(Tide, AerisApiModel);

  return _.expose(Tide, 'aeris.api.models.Tide');
});
