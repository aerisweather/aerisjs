define([
  'aeris/util',
  'aeris/api/models/pointdata',
  'aeris/errors/apiresponseerror'
], function(_, PointData, ApiResponseError) {
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


  /**
   * @method parse
   */
  Lightning.prototype.parse = function(attrs) {
    try {
      attrs.id = this.generateId_(attrs);
    }
    catch (e) {
      if (e instanceof ReferenceError) {
        throw new ApiResponseError('Unable to determine Lightning id: ' + e.message);
      }
    }

    return attrs;
  };


  /**
   * @method generateId_
   * @private
   * @param {Object} attrs Raw response object.
   * @return {string} Generated id value
   */
  Lightning.prototype.generateId_ = function(attrs) {
    // The lightning endpoint does not provide an id
    // Create a unique identifier here, so that we
    // can determine which models from the server
    // we already have in a collection.
    return '' + attrs.loc.lat + attrs.loc.long + attrs.obTimestamp;
  };


  return _.expose(Lightning, 'aeris.api.models.Lightning');
});
