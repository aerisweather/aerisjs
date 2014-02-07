define([
  'ai/util',
  'ai/api/endpoint/model/pointdata',
  'ai/errors/apiresponseerror'
], function(_, PointData, ApiResponseError) {
  /**
   * @publicApi
   * @class Earthquake
   * @namespace aeris.api.model
   * @extends aeris.api.endpoint.model.PointData
   *
   * @constructor
   * @override
   */
  var Earthquake = function(opt_attrs, opt_options) {
    PointData.call(this, opt_attrs, opt_options);
  };
  _.inherits(Earthquake, PointData);


  /**
   * @method parse
   */
  Earthquake.prototype.parse = function(res) {
    var attrs = PointData.prototype.parse.apply(this, arguments);

    if (!res.report || !res.report.id) {
      throw new ApiResponseError('Missing earthquake id');
    }

    attrs.id = res.report.id;

    return attrs;
  };


  return _.expose(Earthquake, 'aeris.api.Earthquake');
});
