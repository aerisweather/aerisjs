define([
  'aeris/util',
  'aeris/errors/validationerror',
  'aeris/errors/apiresponseerror',
  'aeris/api/models/aerisapimodel'
], function(_, ValidationError, ApiResponseError, AerisApiModel) {
  /**
   * A base class for data
   * which is tied to a specified
   * lat/lon location.
   *
   * @class PointData
   * @namespace aeris.api.models
   * @extends aeris.api.models.AerisApiModel
   * @constructor
   */
  var PointData = function(opt_attrs, opt_options) {
    /**
     * @attribute latLon
     * @type {aeris.maps.LatLon}
     */

    var options = _.extend({
      validate: true
    }, opt_options);

    AerisApiModel.call(this, opt_attrs, options);
  };
  _.inherits(PointData, AerisApiModel);



  return PointData;
});
