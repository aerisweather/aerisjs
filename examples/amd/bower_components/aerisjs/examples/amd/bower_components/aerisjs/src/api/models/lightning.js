define([
  'aeris/util',
  'aeris/api/models/pointdata'
], function(_, PointData) {
  /**
   * Represents a lightning data response from the AerisApi
   *
   * @publicApi
   * @class Lightning
   * @namespace aeris.api.models
   * @extends aeris.api.models.PointData
   *
   * @constructor
   * @override
   */
  var Lightning = function(opt_attrs, opt_options) {
    PointData.call(this, opt_attrs, opt_options);
  };
  _.inherits(Lightning, PointData);


  return _.expose(Lightning, 'aeris.api.models.Lightning');
});
