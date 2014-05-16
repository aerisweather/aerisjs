define([
  'aeris/util',
  'aeris/events',
  'aeris/promise',
  'aeris/errors/invalidargumenterror'
], function(_, Events, Promise, InvalidArgumentError) {
  /**
   * An object bound to a strategy.
   *
   * @class StrategyObject
   * @namespace aeris.maps.extensions
   * @constructor
   *
   * @param {Object=} opt_options
   * @param {function():aeris.maps.AbstractStrategy} opt_options.strategy
   *        The constructor for a {aeris.maps.AbstractStrategy} object.
   */
  var StrategyObject = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      strategy: null
    });

    /**
     * The strategy used to interact
     * with the map view.
     *
     * @property strategy_
     * @type {?aeris.maps.AbstractStrategy}
     * @protected
     */
    this.strategy_ = null;

    /**
     * @property StrategyType_
     * @private
     * @type {function():aeris.maps.AbstractStrategy}
     */
    this.StrategyType_ = options.strategy;

    Events.call(this);


    if (!_.isNull(this.StrategyType_)) {
      this.setStrategy(this.StrategyType_);
    }


    /**
     * When a strategy is set on the object.
     *
     * @event strategy:set
     * @param {aeris.maps.AbstractStrategy} strategy
     */
  };
  _.extend(StrategyObject.prototype, Events.prototype);


  /**
   * Set the strategy to use for
   * rendering the StrategyObject.
   *
   * @param {Function} Strategy
   *        Constructor for an {aeris.maps.AbstractStrategy} object.
   * @method setStrategy
   */
  StrategyObject.prototype.setStrategy = function(Strategy) {
    // Clean up any existing strategy
    if (this.strategy_) {
      this.removeStrategy();
    }

    if (!_.isFunction(Strategy)) {
      throw new InvalidArgumentError('Unable to set StrategyObject strategy: ' +
        'invalid strategy constructor.');
    }

    this.StrategyType_ = Strategy;
    this.strategy_ = this.createStrategy_(Strategy);

    this.trigger('strategy:set', this.strategy_);
  };


  /**
   * Create a {aeris.maps.AbstractStrategy} instance.
   *
   * Override to adjust how strategy objects are
   * instantiated.
   *
   * @protected
   *
   * @param {Function} Strategy AbstractStrategy object ctor.
   * @return {aeris.maps.AbstractStrategy}
   * @method createStrategy_
   */
  StrategyObject.prototype.createStrategy_ = function(Strategy) {
    return new Strategy(this);
  };


  /**
   * Remove and clean up the StrategyObject's strategy.
   * @method removeStrategy
   */
  StrategyObject.prototype.removeStrategy = function() {
    if (!this.strategy_) {
      return;
    }

    this.strategy_.destroy();
    this.strategy_ = null;
  };


  /**
   * Reset the rendering strategy used by the
   * object. Useful for re-enabled a strategy which has
   * previously been removed with StrategyObject#removeStrategy
   *
   * @method resetStrategy
   */
  StrategyObject.prototype.resetStrategy = function() {
    if (!this.StrategyType_) {
      throw new Error('Unable to reset strategy: no strategy has yet been defined');
    }

    this.setStrategy(this.StrategyType_);
  };


  return StrategyObject;
});
