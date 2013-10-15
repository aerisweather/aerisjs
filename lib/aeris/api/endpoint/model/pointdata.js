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


  /**
   * @override
   */
  PointData.prototype.validate = function(attrs) {
    if (
      !attrs.latLon ||
      !_.isArray(attrs.latLon) ||
      attrs.latLon.length !== 2 ||
      !_.isNumber(attrs.latLon[0]) ||
      !_.isNumber(attrs.latLon[1])
    ) {
      return new ValidationError('latLon', 'Must be an array two numbers.');
    }
  };


  /**
   * @throws {aeris.errors.APIResponseError}
   *          If response data does not match expected format
   *
   * @override
   */
  PointData.prototype.parse = function(res) {
    var attrs;
    if (!res.loc || !res.loc.lat || !res.loc.long) {
      throw new ApiResponseError('Missing location data');
    }

    // Parse all response attributes
    // into model
    attrs = _.extend({}, res, {
      latLon: [res.loc.lat, res.loc.long]
    });

    return attrs;
  };



  return PointData;
});
