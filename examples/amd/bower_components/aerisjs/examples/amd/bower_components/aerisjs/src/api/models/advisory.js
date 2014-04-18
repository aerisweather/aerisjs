define([
  'aeris/util',
  'aeris/api/models/aerisapimodel'
], function(_, AerisApiModel) {
  /**
   * @publicApi
   * @class Advisory
   * @namespace aeris.api.models
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


  /**
   * @method parse
   */
  Advisory.prototype.parse = function(resp) {
    // Note that a request to the advisories endpoint using an
    // an id returns an array of responses.
    return resp.response ? resp.response[0] : resp;
  };

  return _.expose(Advisory, 'aeris.api.models.Advisory');
});
