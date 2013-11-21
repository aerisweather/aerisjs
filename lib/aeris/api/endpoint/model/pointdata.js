define([
  'aeris/util',
  'aeris/errors/validationerror',
  'aeris/errors/apiresponseerror',
  'aeris/model'
], function(_, ValidationError, ApiResponseError, BaseModel) {
  /**
   * A base class for data
   * which is tied to a specified
   * lat/lon location.
   *
   * @class aeris.api.PointData
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
