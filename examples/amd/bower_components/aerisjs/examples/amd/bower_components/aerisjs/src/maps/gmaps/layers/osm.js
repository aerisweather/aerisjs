define([
  'aeris/util',
  'aeris/maps/strategy/layers/tile'
], function(_, BaseStrategy) {
  var OSMStrategy = function(layer) {
    /**
     * @override
     * @property isBaseLayer_
     */
    this.isBaseLayer_ = true;

    BaseStrategy.apply(this, arguments);
  };

  _.inherits(OSMStrategy, BaseStrategy);


  return OSMStrategy;
});
