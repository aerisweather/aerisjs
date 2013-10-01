define([
  'aeris/util',
  'base/abstractlayer'
], function(_, AbstractLayer) {
  /**
   * Create a layer representing a collection of polygons.
   *
   * @constructor
   * @class aeris.maps.layers.Polygons
   * @extends aeris.maps.AbstractLayer
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

    AbstractLayer.call(this, attrs, opt_options);
  };

  _.inherits(Polygons, AbstractLayer);


  /**
   * @param {number} opacity
   */
  Polygons.prototype.setOpacity = function(opacity) {
    this.set('opacity', opacity, { validate: true });
  };


  return Polygons;
});
