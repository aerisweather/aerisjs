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
   * @param {Function|String=} opt_options.strategy
   *        The constructor for a {aeris.maps.AbstractStrategy} object.
   *
   *        OR
   *
   *        The path to the strategy object (without the
   *        map strategy prefix). eg. 'layers/sometiletype'.
   *
   *        Note that using a string path will result in asynchronous loading
   *        of the strategy. To handle loading callbacks and errors, use the
   *        loadStrategy_ method, instead.
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
     * @property strategy_
     */
    this.strategy_ = null;

    Events.call(this);


    // Set strategy from ctor options
    if (_.isString(options.strategy)) {
      this.loadStrategy_(options.strategy).
        // Throw an uncatchable here,
        // because we are not otherwise exposing
        // error handlers for this load promise.
        fail(function(e) { _.defer(function() { throw e; }); });
    }
    else if (!_.isNull(options.strategy)) {
      this.setStrategy_(options.strategy);
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
   * @protected
   * @method setStrategy_
   */
  StrategyObject.prototype.setStrategy_ = function(Strategy) {
    // Clean up any existing strategy
    if (this.strategy_) {
      this.removeStrategy();
    }

    if (!_.isFunction(Strategy)) {
      throw new InvalidArgumentError('Unable to set StrategyObject strategy: ' +
        'invalid strategy constructor.');
    }

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
   * Set a strategy, using an RequireJS module path.
   *
   * @throws {InvalidArgumentError} If module does not exist.
   *
   * @param {string} path
   * @return {aeris.Promise} A promise to load and set the strategy.
   * @method loadStrategy_
   * @protected
   */
  StrategyObject.prototype.loadStrategy_ = function(path) {
    var loadPromise = new Promise();

    require(['aeris/maps/strategy/' + path],
      _.bind(function(Strategy) {
        this.setStrategy_(Strategy);

        loadPromise.resolve();
      }, this),
      function(e) {
        loadPromise.reject(new InvalidArgumentError('Unable to load Strategy module: ' +
          e.message));
      });

    return loadPromise;
  };


  /**
   * Remove and clean up the StrategyObject's strategy.
   * @method removeStrategy
   */
  StrategyObject.prototype.removeStrategy = function() {
    if (!this.strategy_) { return; }

    this.strategy_.destroy();
    this.strategy_ = null;
  };


  return StrategyObject;
});
