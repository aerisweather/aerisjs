define([
  'aeris/util',
  'strategy/layerstrategies/abstractlayerstrategy'
], function(_, AbstractLayerStrategy) {
  /**
   * A strategy for rendering a Tile layer with OpenLayers.
   *
   * @constructor
   * @class aeris.maps.openlayers.layerstrategies.TileStrategy
   * @extends aeris.maps.openlayers.layerstrategies.AbstractLayerStrategy
   */
  var TileStrategy = function(layer) {
    AbstractLayerStrategy.call(this, layer);

    this.proxyLoadEvent_();
  };
  _.inherits(TileStrategy, AbstractLayerStrategy);


  /**
   * @override
   */
  TileStrategy.prototype.createView_ = function() {
    this.view_ = new OpenLayers.Layer.XYZ(
      this.object_.get('name'),
      this.getTileUrls_(),
      {
        isBaseLayer: false,
        sphericalMercator: true,
        wrapDateLine: true,
        transitionEffect: 'resize'
      }
    );

    this.updateOpacity_();
    this.updateZIndex_();

    return this.view_;
  };


  /**
   * @return {Array.<string>}
   *          A list of available Aeris Interactive tile
   *          endpoint urls.
   * @protected
   */
  TileStrategy.prototype.getTileUrls_ = function() {
    var urls = [];

    _.each(this.object_.get('subdomains'), function(subdomain) {
      var url = this.object_.getUrl().
        replace(/\{d\}/, subdomain).
        replace(/\{z\}/, '${z}').
        replace(/\{x\}/, '${x}').
        replace(/\{y\}/, '${y}');
      urls.push(url);
    }, this);

    return urls;
  };


  /**
   * Trigger a 'load' event on the layer object,
   * when the OL tiles are loaded.
   *
   * @private
   */
  TileStrategy.prototype.proxyLoadEvent_ = function() {
    this.getView().events.register('loadend', this, _.bind(function() {
      this.object_.trigger('load');
    }, this));
  };


  return TileStrategy;
});
