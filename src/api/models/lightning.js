define([
  'aeris/util',
  'aeris/api/models/pointdata',
  'aeris/errors/apiresponseerror'
], function(_, PointData, ApiResponseError) {
  /**
   * Represents a lightning data response from the AerisApi
   *
   * @publicApi
   * @class aeris.api.models.Lightning
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
      // The lightning endpoint does not provide an id
      // Create a unique identifier here, so that we
      // can determine which models from the server
      // we already have in a collection.
      attrs.id = '' + attrs.loc.lat + attrs.loc.long + attrs.obTimestamp;
    }
    catch (e) {
      if (e instanceof ReferenceError) {
        throw new ApiResponseError('Unable to determine Lightning id: ' + e.message);
      }
      else {
        throw e;
      }
    }

    return attrs;
  };


  return _.expose(Lightning, 'aeris.api.models.Lightning');
});
