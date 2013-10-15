define([
  'aeris/util',
  'api/endpoint/model/pointdata'
], function(_, PointData) {
  /**
   * Represents a lightning data response from the AerisApi
   *
   * @class aeris.api.model.Lightning
   * @extends aeris.api.model.PointData
   *
   * @constructor
   */
  var Lightning = function(opt_attrs, opt_options) {
    PointData.call(this, opt_attrs, opt_options);
  };
  _.inherits(Lightning, PointData);


  return Lightning;
});
