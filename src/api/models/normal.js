define([
  'aeris/util',
  'aeris/api/models/aerisapimodel'
], function(_, AerisApiModel) {
  /**
   * @publicApi
   * @class Normal
   * @namespace aeris.api.models
   * @extends aeris.api.models.AerisApiModel
   *
   * @constructor
   * @override
   */
  var Normal = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      endpoint: 'normals',
      params: {}
    });

    _.defaults(options.params, {
      p: ':auto'
    });

    AerisApiModel.call(this, opt_attrs, options);
  };
  _.inherits(Normal, AerisApiModel);

  return _.expose(Normal, 'aeris.api.models.Normal');
});
