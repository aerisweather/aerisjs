define([
  'ai/util',
  'ai/maps/strategy/layerstrategies/tile'
], function(_, BaseStrategy) {
  /**
   * @override
   * @class AerisTileStrategy
   * @namespace aeris.maps.gmaps.layerstrategies
   * @extends aeris.maps.gmaps.layerstrategies.TileLayerStrategy
   * @constructor
   */
  var AerisTileStrategy = function(layer) {
    /**
     * @override
     * @property isBaseLayer_
     */
    this.isBaseLayer_ = false;

    BaseStrategy.apply(this, arguments);

    this.listenTo(this.object_, {
      'change:time': this.recreateView_
    });
  };

  _.inherits(AerisTileStrategy, BaseStrategy);


  /**
   * Create a new instance of the {google.maps.ImageMapType} view.
   * A brute-force way to reset any {google.maps.ImageMapTypeOptions} which
   * may have changed
   *
   * @private
   * @method recreateView_
   */
  AerisTileStrategy.prototype.recreateView_ = function() {
    this.view_ = this.createView_();
    this.remove();
    this.setMap(this.object_.get('map'));
  };


  AerisTileStrategy.prototype.getUrl_ = function(coord, zoom) {
    var url = BaseStrategy.prototype.getUrl_.apply(this, arguments);

    if (!url) { return null; }

    return url.replace(/\{t\}/, this.object_.getAerisTimeString());
  };


  return AerisTileStrategy;
});
