define([
  'aeris/util',
  'aeris/api/models/pointdata'
], function(_, PointData) {
  /**
   * @publicApi
   * @class Fire
   * @namespace aeris.api.models
   * @extends aeris.api.models.PointData
   *
   * @constructor
   * @override
   */
  var Fire = function(opt_attrs, opt_options) {
    PointData.call(this, opt_attrs, opt_options);
  };
  _.inherits(Fire, PointData);


  /**
   * @method parse
   */
  Fire.prototype.parse = function(res) {
    var attrs = PointData.prototype.parse.apply(this, arguments);

    if (!res.report || !res.report.id) {
      throw new ApiResponseError('Missing earthquake id');
    }

    attrs.id = res.report.id;

    return attrs;
  };


  return _.expose(Fire, 'aeris.api.models.Fire');
});
