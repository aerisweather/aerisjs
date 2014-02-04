define([
  'ai/util',
  'ai/maps/abstractstrategy',
  'ai/maps/strategy/events'
], function(_, BaseAbstractStrategy, GoogleEvents) {
  /**
   * Base class for Google Maps strategies.
   *
   * @class AbstractStrategy
   * @namespace aeris.maps.gmaps
   * @extends aeris.maps.AbstractStrategy
   *
   * @constructor
  */
  var AbstractStrategy = function(object, opt_options) {
    var options = _.defaults(opt_options || {}, {
      googleEvents: new GoogleEvents()
    });


    /**
     * Helper for binding google.maps.event
     * events.
     *
     * @type {aeris.maps.gmaps.GoogleEvents}
     * @protected
     */
    this.googleEvents_ = options.googleEvents;


    BaseAbstractStrategy.apply(this, arguments);
  };
  _.inherits(AbstractStrategy, BaseAbstractStrategy);


  /**
   * @override
   * @method destroy
   */
  AbstractStrategy.prototype.destroy = function() {
    BaseAbstractStrategy.prototype.destroy.apply(this, arguments);

    this.googleEvents_.stopListening();
  };


  return AbstractStrategy;
});
