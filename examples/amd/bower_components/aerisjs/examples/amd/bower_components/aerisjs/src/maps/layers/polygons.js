define([
  'aeris/util',
  'aeris/maps/layers/layer'
], function(_, Layer) {
  /**
   * Create a layer representing a collection of polygons.
   *
   * @constructor
   * @class Polygons
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.Layer
   * @abstract
   */
  var Polygons = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      /**
       * @attribute opacity
       * @type {number}
       */
      opacity: 1.0
    }, opt_attrs);

    Layer.call(this, attrs, opt_options);
  };

  _.inherits(Polygons, Layer);


  /**
   * @param {number} opacity
   * @method setOpacity
   */
  Polygons.prototype.setOpacity = function(opacity) {
    this.set('opacity', opacity, { validate: true });
  };


  return Polygons;
});
