define([
  'aeris/util',
  'aeris/errors/invalidargumenterror'
], function(_, InvalidArgumentError) {
  /**
   * A Mixin for Marionette.View classes.
   *
   * @class aeris.application.controller.mixin.ViewMixin
   * @static
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
     * @return {Object.<string,string>} A safe copy of the UI bindings hash.
     * @private
     */
    getUIBindingsCopy_: function() {
      var bindings = this.getUIBindings_();
      return (bindings ? _.clone(bindings) : {});
    },


    /**
     * @return {Object.<string,string>} Selectors for named UI elements.
     * @private
     */
    getUIBindings_: function() {
      // Marionette converts the ui hash of selector strings defined
      // in the ItemView ctor to a hash of jQuery objects,
      // and saves the hash of selectors in this._uiBindings.
      //
      // If no this._uiBindings is defined,  this.ui must be a
      // hash of selector strings.
      return _.result(this, '_uiBindings') || _.result(this, 'ui');
    },

    /**
     * Declare named UI elements.
     *
     * Binds any undefined UI element names
     * to an empty selector. This allows the resolved UI element to be
     * referenced in the Controller code, even if there
     * is no selector is otherwise defined.
     *
     * @param {...string} var_uiNames
     */
    declareUI: function(var_uiNames) {
      var uiNames = _.argsToArray(arguments);

      // Reduce array of declared ui
      // to an object with empty values.
      var declaredUIBindings = _.reduce(uiNames, function(memo, name) {
        memo[name] = '';
        return memo;
      }, {});

      this.ui = _.defaults(this.getUIBindings_() || {}, declaredUIBindings);
    }
  };

  return ViewMixin;
});
