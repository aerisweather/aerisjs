define([
  'aeris/util',
  'googlemaps!'
], function(_, gmaps) {

  /**
   * Helper for binding events to google maps objects.
   *
   * @class GoogleEvents
   * @namespace aeris.maps.gmaps
   *
   * @constructor
   */
  var GoogleEvents = function() {
    /**
     * A cache of event bindings
     * being managed by this object.
     *
     * @type {Array}
     * @private
     * @property listeners_
     */
    this.listeners_ = [
      /*
      obj: [obj we're listening to]
      ref: [event obj returned from google],
      topic: [topic],
       */
    ];
  };


  /**
   * Listen to events triggered by a google maps
   * object.
   *
   * @param {Object} obj Google maps object.
   * @param {Object.<string,Function>|string} event An events hash, or a topic.
   * @param {Function=} opt_handler If used with an event string, the handler for that topic.
   *                            If using an event hash, this argument is the ctx.
   * @param {Object=} opt_ctx Context within which to call the handler.
   * @method listenTo
   */
  GoogleEvents.prototype.listenTo = function(obj, event, opt_handler, opt_ctx) {
    var eventHash;
    var listeners = [];
    var ctx;

    if (_.isObject(event)) {
      eventHash = event;
      ctx = opt_handler;
    }
    else {
      (eventHash = {})[event] = opt_handler;
      ctx = opt_ctx;
    }

    _.each(eventHash, function(cb, topic) {
      // Bind context
      cb = ctx ? _.bind(cb, ctx) : cb;

      listeners.push({
        obj: obj,
        topic: topic,
        ref: gmaps.event.addListener(obj, topic, cb)
      });
    }, this);

    this.listeners_ = this.listeners_.concat(listeners);
  };


  /**
   * Stop listening to events which were bound
   * using 'listenTo'.
   *
   * If you pass in an object, only events tied to that
   * object will be removed.
   *
   * @param {Object} opt_obj A Google maps object.
   * @method stopListening
   */
  GoogleEvents.prototype.stopListening = function(opt_obj) {
    var toRemove = this.listeners_;

    if (opt_obj) {
      toRemove = _.where(toRemove, { obj: opt_obj });
    }

    // Remove event listeners
    _.each(toRemove, function(listener) {
      gmaps.event.removeListener(listener.ref);
    }, this);


    // Clean up this.listeners_ obj
    this.listeners_ = _.difference(this.listeners_, toRemove);
  };


  return GoogleEvents;
});
