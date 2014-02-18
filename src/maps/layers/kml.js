define([
  'aeris/util',
  'aeris/maps/layers/animationlayer',
  'aeris/maps/strategy/layers/kml'
], function(_, BaseLayer, Strategy) {
  /**
   * Representation of KML layer.
   *
   * @constructor
   * @class KML
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.Layer
   */
  var KML = function(opt_attrs, opt_options) {
    var options = _.extend({
      strategy: 'layers/kml'
    }, opt_options);
    var attrs = _.extend({
      /**
       * The url to the KML file.
       *
       * @attribute url
       * @type {string}
       */
      url: undefined
    }, opt_attrs);

    BaseLayer.call(this, attrs, options);
  };
  _.inherits(KML, BaseLayer);


  return KML;

});
