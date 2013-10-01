define([
  'aeris/util',
  'base/layerstrategies/abstractlayerstrategy'
], function(_, BaseLayerStrategy) {
  /**
   * A partial layer strategy implementation,
   * with logic common to all OpenLayers layers.
   *
   * @class aeris.maps.openlayers.layerstrategies.AbstractLayerStrategy
   * @extends aeris.maps.layerstrategies.AbstractLayerStrategy
   */
  var AbstractLayerStrategy = function(layer) {
    /**
     * @type {Boolean}
     * @private
     */
    this.isBaseLayer_ = _.isUndefined(this.isBaseLayer_) ? false : this.isBaseLayer_;


    BaseLayerStrategy.call(this, layer);


    this.layer_.on({
      'change:opacity': this.updateOpacity_,
      'change:zIndex': this.updateZIndex_
    }, this);
  };
  _.inherits(AbstractLayerStrategy, BaseLayerStrategy);


  /**
   * @override
   */
  AbstractLayerStrategy.prototype.setMap = function(aerisMap) {
    BaseLayerStrategy.prototype.setMap.apply(this, arguments);


    this.mapView_.addLayer(this.getView());

    if (this.isBaseLayer_) {
      this.mapView_.setBaseLayer(this.getView());
    }
  };


  /**
   * @override
   */
  AbstractLayerStrategy.prototype.beforeRemove_ = function() {
    this.mapView_.removeLayer(this.getView());
  };


  /**
   * @private
   */
  AbstractLayerStrategy.prototype.updateOpacity_ = function() {
    var opacity = parseFloat(this.layer_.get('opacity'));

    // Note that using OL's 'setOpacity' method
    // will cause a fade transition, which
    // may not be desired.
    this.getView().div.style.opacity = opacity;
  };


  /**
   * @private
   */
  AbstractLayerStrategy.prototype.updateZIndex_ = function() {
    var zIndex = parseInt(this.layer_.get('zIndex'));
    this.getView().setZIndex(zIndex);
  };


  return AbstractLayerStrategy;
});
