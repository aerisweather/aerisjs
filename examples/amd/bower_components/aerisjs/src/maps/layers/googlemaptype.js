define([
  'aeris/util',
  'aeris/errors/unimplementedpropertyerror',
  'aeris/maps/layers/layer'
], function(_, UnimplementedPropertyError, BaseLayer) {
  /**
   * An abstract representation of a Google MapType layer.
   *
   * @constructor
   * @class GoogleMapType
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.Layer
   */
  var GoogleMapType = function(opt_attrs, opt_options) {
    var options = _.extend({
      strategy: 'layers/googlemaptype'
    }, opt_options);


    /**
     * The string representing the Google Map Type.
     * see: https://developers.google.com/maps/documentation/javascript/reference#MapTypeId
     *
     * @type {string}
     * @attribute mapTypeId
     */


    BaseLayer.call(this, opt_attrs, options);
  };
  _.inherits(GoogleMapType, BaseLayer);


  /**
   * @method validate
   */
  GoogleMapType.prototype.validate = function(attrs) {
    if (_.isUndefined(attrs.mapTypeId)) {
      return 'mapTypeId | MapTypeId must be defined';
    }

    return BaseLayer.prototype.validate.apply(this, arguments);
  };


  return _.expose(GoogleMapType, 'aeris.maps.layers.GoogleMapType');

});
