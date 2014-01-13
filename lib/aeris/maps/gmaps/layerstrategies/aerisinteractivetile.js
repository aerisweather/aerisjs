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

    this.listenTo(this.object_, {
      'change:time': this.recreateView_
    });
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
    this.setMap(this.object_.get('map'));
  };


  AerisInteractiveTileStrategy.prototype.getUrl_ = function(coord, zoom) {
    var url = BaseStrategy.prototype.getUrl_.apply(this, arguments);

    if (!url) { return null; }

    return url.replace(/\{t\}/, this.object_.getAerisTimeString());
  };


  return AerisInteractiveTileStrategy;
});
