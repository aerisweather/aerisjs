define([
  'aeris/util',
  'aeris/api/models/aerisapimodel'
], function(_, AerisApiModel) {
  /**
   * @publicApi
   * @class Observation
   * @namespace aeris.api.model
   * @extends aeris.api.endpoint.model.AerisApiModel
   *
   * @constructor
   * @override
   */
  var Observation = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      endpoint: 'observations'
    });

    AerisApiModel.call(this, opt_attrs, options);
  };
  _.inherits(Observation, AerisApiModel);

  return _.expose(Observation, 'aeris.api.models.Observation');
});
