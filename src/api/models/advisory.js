define([
  'aeris/util',
  'aeris/api/models/aerisapimodel'
], function(_, AerisApiModel) {
  /**
   * @publicApi
   * @class Advisory
   * @namespace aeris.api.model
   * @extends aeris.api.endpoint.model.AerisApiModel
   *
   * @constructor
   * @override
   */
  var Advisory = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      endpoint: 'advisories'
    });

    AerisApiModel.call(this, opt_attrs, options);
  };
  _.inherits(Advisory, AerisApiModel);

  return _.expose(Advisory, 'aeris.api.models.Advisory');
});
