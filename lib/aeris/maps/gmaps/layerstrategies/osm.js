define([
  'aeris/util',
  'strategy/layerstrategies/tile'
], function(_, BaseStrategy) {
  var OSMStrategy = function(layer) {
    /**
     * @override
     */
    this.isBaseLayer_ = true;

    BaseStrategy.apply(this, arguments);
  };

  _.inherits(OSMStrategy, BaseStrategy);


  return OSMStrategy;
});
