define([
  'aeris/util',
  'aeris/maps/abstractstrategy'
], function(_, BaseLayerStrategy) {
  /**
   * A partial layer strategy implementation,
   * with logic common to all OpenLayers layers.
   *
   * @class AbstractLayerStrategy
   * @namespace aeris.maps.openlayers.layers
   * @extends aeris.maps.AbstractStrategy
   *
   * @abstract
   */
  var AbstractLayerStrategy = function(layer) {
    /**
     * @type {Boolean}
     * @private
     * @property isBaseLayer_
     */
    this.isBaseLayer_ = _.isUndefined(this.isBaseLayer_) ? false : this.isBaseLayer_;


    BaseLayerStrategy.call(this, layer);


    this.listenTo(this.object_, {
      'change:opacity': this.updateOpacity_,
      'change:zIndex': this.updateZIndex_
    });
  };
  _.inherits(AbstractLayerStrategy, BaseLayerStrategy);


  /**
   * @method setMap
   */
  AbstractLayerStrategy.prototype.setMap = function(aerisMap) {
    BaseLayerStrategy.prototype.setMap.apply(this, arguments);


    this.mapView_.addLayer(this.getView());

    if (this.isBaseLayer_) {
      this.mapView_.setBaseLayer(this.getView());
    }
  };


  /**
   * @method beforeRemove_
   */
  AbstractLayerStrategy.prototype.beforeRemove_ = function() {
    this.mapView_.removeLayer(this.getView());
  };


  /**
   * @private
   * @method updateOpacity_
   */
  AbstractLayerStrategy.prototype.updateOpacity_ = function() {
    var opacity = parseFloat(this.object_.get('opacity'));

    // Note that using OL's 'setOpacity' method
    // will cause a fade transition, which
    // may not be desired.
    this.getView().div.style.opacity = opacity;
  };


  /**
   * @private
   * @method updateZIndex_
   */
  AbstractLayerStrategy.prototype.updateZIndex_ = function() {
    var zIndex = parseInt(this.object_.get('zIndex'));
    this.getView().setZIndex(zIndex);
  };


  return AbstractLayerStrategy;
});
