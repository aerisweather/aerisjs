define(['aeris/util'], function(_) {

  /**
   * @fileoverview JavaScript implementation of the Strategy pattern (kind of).
   */


  _.provide('aeris.Strategy');


  /**
   * Create a new container for the strategies that can correctly support the
   * handling object.
   *
   * @constructor
   */
  aeris.Strategy = function() {


    /**
     * An array of strategies in ascending order of priority.
     *
     * @type {Array.<string>}
     * @private
     */
    this.strategies_ = [];

  };


  /**
   * Push a new strategy type as the highest priority.
   *
   * @param {string} strategy The type of strategy.
   * @return {undefined}
   */
  aeris.Strategy.prototype.push = function(strategy) {
    this.strategies_.push(strategy);
  };


  /**
   * Determine the best consumer of the prioritized strategies.
   *
   * @param {Object.<string,Object>} consumers A hash of provided strategy
   *                                           consumers.
   * @return {Object|null} Return the highest prioritized provided strategy, or
   *                       null if no provided strategy satisfies conditions.
   */
  aeris.Strategy.prototype.select = function(consumers) {
    var best = null;
    var length = this.strategies_.length;
    for (var i = length - 1; i >= 0; i--) {
      var strategy = this.strategies_[i];
      var consumer = consumers[strategy];
      if (consumer) {
        best = strategy;
        break;
      }
    }
    return best;
  };


  return aeris.Strategy;

});
