define([
  'aeris/util',
  'aeris/api/models/aerisapimodel'
], function(_, AerisApiModel) {
  /**
   * @publicApi
   * @class StormCell
   * @namespace aeris.api.models
   * @extends aeris.api.models.AerisApiModel
   *
   * @constructor
   * @override
   */
  var StormCell = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      endpoint: 'stormcells',
      params: {}
    });

    _.defaults(options.params, {
      p: ':auto',
      limit: 100,
      radius: '100mi'
    });

    AerisApiModel.call(this, opt_attrs, options);
  };
  _.inherits(StormCell, AerisApiModel);

  return _.expose(StormCell, 'aeris.api.models.StormCell');
});
