define([
  'ai/util',
  'ai/api/endpoint/model/aerisapimodel'
], function(_, AerisApiModel) {
  /**
   * @publicApi
   * @class Forecast
   * @namespace aeris.api.endpoint.model
   * @extends aeris.api.endpoint.model.AerisApiModel
   *
   * @constructor
   * @override
  */
  var Forecast = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      endpoint: 'forecasts'
    });

    AerisApiModel.call(this, opt_attrs, options);
  };
  _.inherits(Forecast, AerisApiModel);


  return _.expose(Forecast, 'aeris.api.Forecast');
});
