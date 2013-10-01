define([
  'aeris/util',
  'strategy/layerstrategies/tile'
], function(_, BaseStrategy) {
  /**
   * @override
   * @class aeris.maps.gmaps.layerstrategies.AerisInteractiveTileStrategy
   * @extends aeris.maps.gmaps.layerstrategies.TileLayerStrategy
   * @constructor
   */
  var AerisInteractiveTileStrategy = function(layer) {
    /**
     * @override
     */
    this.isBaseLayer_ = false;

    BaseStrategy.apply(this, arguments);

    this.object_.on({
      'change:time': this.recreateView_
    }, this);
  };

  _.inherits(AerisInteractiveTileStrategy, BaseStrategy);


  /**
   * Create a new instance of the {google.maps.ImageMapType} view.
   * A brute-force way to reset any {google.maps.ImageMapTypeOptions} which
   * may have changed
   *
   * @private
   */
  AerisInteractiveTileStrategy.prototype.recreateView_ = function() {
    this.view_ = this.createView_();
    this.remove();
    this.setMap(this.layer_.get('map'));
  };


  AerisInteractiveTileStrategy.prototype.getUrl_ = function(coord, zoom) {
    var url = BaseStrategy.prototype.getUrl_.apply(this, arguments);

    return url.replace(/\{t\}/, this.layer_.getAerisTimeString());
  };


  return AerisInteractiveTileStrategy;
});
