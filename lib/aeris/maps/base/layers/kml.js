define([
  'aeris/util',
  'base/layers/animationlayer',
  'strategy/layerstrategies/kml'
], function(_, BaseLayer, Strategy) {
  /**
   * Representation of KML layer.
   *
   * @constructor
   * @class aeris.maps.layers.KML
   * @extends aeris.maps.AbstractLayer
   */
  var KML = function(opt_attrs, opt_options) {
    var options = _.extend({
      strategy: 'layerstrategies/kml'
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
