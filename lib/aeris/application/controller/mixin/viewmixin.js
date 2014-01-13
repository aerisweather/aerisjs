define([
  'aeris/util',
  'vendor/marionette',
  'aeris/errors/invalidargumenterror',
  'application/controller/templatehelperregistrar/handlebarstemplatehelperregistrar'
], function(_, Marionette, InvalidArgumentError, HandlebarsTemplateHelperRegistrar) {
  /**
   * @class aeris.application.controller.ViewMixin
   * @extends Marionette.View
   * 
   * @param {Object=} opt_options
   * @param {aeris.application.controller.templatehelperregistrar.TemplateHelperRegistrarInterface=} opt_options.templateHelperRegistrar
   * 
   * @constructor
   */
  var ViewMixin = function(opt_options) {
    var options = opt_options || {};

    this.templateHelperRegistrar_ = options.templateHelperRegistrar || new HandlebarsTemplateHelperRegistrar();
  };


  /** 
   * @override
   * 
   * @return {Function}
   */
  ViewMixin.getTemplate = function() {
    var template = Marionette.View.prototype.getTemplate.apply(this, arguments);
    var helpers = Marionette.getOption(this, "handlebarsHelpers");
    var templateData, templateBoundToHelpers;

    if (!helpers) { return template; }

    this.templateHelperRegistrar_.setTemplate(template);
    this.templateHelperRegistrar_.setHelpers(helpers);

    templateData = this.serializeData();
    templateBoundToHelpers = this.templateHelperRegistrar_.getTemplateWithHelpersBoundTo(templateData);

    return templateBoundToHelpers;
  };


  /**
   * Bind an event to a named
   * UI element.
   *
   * Handler will be called in the context
   * of the view controller.
   *
   * @throws {aeris.errors.InvalidArgumentError}
   *        If the named UI is not bound to a selector.
   *
   * @param {string} topic
   * @param {string} uiName
   * @param {Function} handler
   * @param {Object} opt_ctx
   */
  ViewMixin.bindUIEvent = function(topic, uiName, handler, opt_ctx) {
    var selector = this.getUIBindingsCopy_()[uiName];

    if (_.isUndefined(selector)) {
      throw new InvalidArgumentError('Unable to bind UI element "' + uiName + ': ' +
        'No binding is been defined.');
    }

    // Prevent binding to empty selector,
    // which would in fact bind to the parent $el.
    if (!selector.length) { return; }

    this.delegateSingleEvent_(topic, selector, handler, opt_ctx);
  };


  /**
   * Note that unlike Backbone.View#delegateEvents,
   * this method does not have the side-effect of
   * un-delegating all previous events.
   *
   * @param {string} topic
   * @param {string} opt_selector
   * @param {Function} handler
   * @param {Object} opt_ctx
   * @private
   */
  ViewMixin.delegateSingleEvent_ = function(topic, opt_selector, handler, opt_ctx) {
    var scopedTopic = topic + '.' + this.getEventScope_();
    var selector = opt_selector || '';
    var ctxBoundHandler = opt_ctx ? _.bind(handler, opt_ctx) : handler;

    var argsWithSelector = [scopedTopic, selector, ctxBoundHandler];
    var argsWithoutSelector = [scopedTopic, ctxBoundHandler];
    var eventBindingArgs = selector.length ? argsWithSelector : argsWithoutSelector;

    this.$el.on.apply(this.$el, eventBindingArgs);
  };


  /**
   * @return {string}
   * @private
   */
  ViewMixin.getEventScope_ = function() {
    return 'delegateEvents' + this.cid;
  };


  /**
   * @return {Object.<string,string>} A safe copy of the UI bindings hash.
   * @private
   */
  ViewMixin.getUIBindingsCopy_ = function() {
    var bindings = this.getUIBindings_();
    return (bindings ? _.clone(bindings) : {});
  };


  /**
   * @return {Object.<string,string>} Selectors for named UI elements.
   * @private
   */
  ViewMixin.getUIBindings_ = function() {
    // Marionette converts the ui hash of selector strings defined
    // in the ItemView ctor to a hash of jQuery objects,
    // and saves the hash of selectors in this._uiBindings.
    //
    // If no this._uiBindings is defined,  this.ui must be a
    // hash of selector strings.
    return _.result(this, '_uiBindings') || _.result(this, 'ui');
  };


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
  ViewMixin.declareUI = function(var_uiNames) {
    var uiNames = _.argsToArray(arguments);

    // Reduce array of declared ui
    // to an object with empty values.
    var declaredUIBindings = _.reduce(uiNames, function(memo, name) {
      memo[name] = '';
      return memo;
    }, {});

    this.ui = _.defaults(this.getUIBindings_() || {}, declaredUIBindings);
  };



  return ViewMixin;
});
