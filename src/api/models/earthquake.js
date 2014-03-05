define([
  'aeris/util',
  'aeris/api/models/pointdata',
  'aeris/errors/apiresponseerror'
], function(_, PointData, ApiResponseError) {
  /**
   * @publicApi
   * @class Earthquake
   * @namespace aeris.api.models
   * @extends aeris.api.models.PointData
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


  /**
   * @method testFilter
   */
  Earthquake.prototype.testFilter = function(filter) {
    if (filter === 'shallow') {
      return this.isShallow();
    }

    return filter === this.getAtPath('report.type');
  };


  /**
   * Is the earthquake less than 70km deep.
   *
   * @method isShallow
   * @private
   * @return {Boolean}
   */
  Earthquake.prototype.isShallow = function() {
    return this.getAtPath('report.depthKM') < 70;
  };


  return _.expose(Earthquake, 'aeris.api.models.Earthquake');
});
