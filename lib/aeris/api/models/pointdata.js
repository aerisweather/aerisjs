define([
  'ai/util',
  'ai/errors/validationerror',
  'ai/errors/apiresponseerror',
  'ai/model'
], function(_, ValidationError, ApiResponseError, BaseModel) {
  /**
   * A base class for data
   * which is tied to a specified
   * lat/lon location.
   *
   * @class PointData
   * @namespace aeris.api.models
   * @extends aeris.Model
   * @constructor
   */
  var PointData = function(opt_attrs, opt_options) {
    /**
     * @attribute latLon
     * @type {Array.<number>}
     */

    var options = _.extend({
      validate: true
    }, opt_options);

    BaseModel.call(this, opt_attrs, options);
  };
  _.inherits(PointData, BaseModel);



  return PointData;
});
