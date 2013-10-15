define([
  'aeris/util',
  'api/endpoint/model/pointdata'
], function(_, PointData) {
  /**
   * @class aeris.api.model.Fire
   * @extends aeris.api.model.PointData
   *
   * @constructor
   */
  var Fire = function(opt_attrs, opt_options) {
    PointData.call(this, opt_attrs, opt_options);
  };
  _.inherits(Fire, PointData);


  /**
   * @override
   */
  Fire.prototype.parse = function(res) {
    var attrs = PointData.prototype.parse.apply(this, arguments);

    if (!res.report || !res.report.id) {
      throw new ApiResponseError('Missing earthquake id');
    }

    attrs.id = res.report.id;

    return attrs;
  };


  return Fire;
});
