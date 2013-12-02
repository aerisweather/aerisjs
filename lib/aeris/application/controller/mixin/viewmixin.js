define([
  'aeris/util',
  'aeris/errors/invalidargumenterror'
], function(_, InvalidArgumentError) {
  /**
   * A Mixin for Marionette.View classes.
   *
   * @type {Object.<string,Function>}
   */
  var ViewMixin = {
    /**
     * Bind an event to a named
     * UI element.
     *
     * @throws {aeris.errors.InvalidArgumentError}
     *        If the named UI is not bound to a selector.
     *
     * @param {string} topic
     * @param {string} uiName
     * @param {Function} handler
     */
    bindUIEvent: function(topic, uiName, handler) {
      var eventsHash = {};
      var selector = this.getUIBindingsCopy_()[uiName];

      if (!selector) {
        throw new InvalidArgumentError('Unable to bind UI element "' + uiName + ': ' +
          'No binding is been defined.');
      }

      eventsHash[topic + ' ' + selector] = handler;
      this.delegateEvents(eventsHash);
    },


    /**
     * @return {Object} A safe copy of the UI bindings hash.
     * @private
     */
    getUIBindingsCopy_: function() {
      var bindings = _.result(this, "_uiBindings") || this.ui;
      return (bindings ? _.clone(bindings) : {});
    }
  };

  return ViewMixin;
});
