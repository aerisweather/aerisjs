define([
  'aeris/util',
  'aeris/api/models/aerisapimodel'
], function(_, AerisApiModel) {
  /**
   * @publicApi
   * @class aeris.api.models.Advisory
   * @extends aeris.api.models.AerisApiModel
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
