define([
  'aeris/util',
  'aeris/errors/unimplementedpropertyerror',
  'aeris/maps/layers/layer',
  'aeris/maps/strategy/layers/googlemaptype'
], function(_, UnimplementedPropertyError, BaseLayer, GoogleMapTypeStrategy) {
  /**
   * An abstract representation of a Google MapType layer.
   *
   * @constructor
   * @class aeris.maps.layers.GoogleMapType
   * @extends aeris.maps.layers.Layer
   */
  var GoogleMapType = function(opt_attrs, opt_options) {
    var options = _.extend({
      strategy: GoogleMapTypeStrategy
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
