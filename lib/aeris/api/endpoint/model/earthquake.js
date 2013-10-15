define([
  'aeris/util',
  'api/endpoint/model/pointdata',
  'aeris/errors/apiresponseerror'
], function(_, PointData, ApiResponseError) {
  /**
   * @class aeris.api.model.Earthquake
   * @extends aeris.api.model.PointData
   *
   * @constructor
   */
  var Earthquake = function(opt_attrs, opt_options) {
    PointData.call(this, opt_attrs, opt_options);
  };
  _.inherits(Earthquake, PointData);


  /**
   * @override
   */
  Earthquake.prototype.parse = function(res) {
    var attrs = PointData.prototype.parse.apply(this, arguments);

    if (!res.report || !res.report.id) {
      throw new ApiResponseError('Missing earthquake id');
    }

    attrs.id = res.report.id;

    return attrs;
  };


  return Earthquake;
});
