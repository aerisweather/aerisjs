define([
  'aeris/util',
  'vendor/backbone',
  'vendor/jquery',
  'mapbuilder/core/module/module'
], function(_, Backbone, $, BaseModule) {
  /**
   * Base Application class.
   *
   * An application:
   * - Is  type of module
   * - Has child modules.
   * - Is the single entry point for starting an application.
   *   All other modules are started by the application.
   * - Has an element on the DOM.
   *   This element is defined when starting the application.
   * - Renders a layout within it's DOM element.
   *   Modules may be rendered within regions of this layout.
   * - Has a router.
   * - Starts the Backbone history.
   *
   * @class aeris.builder.maps.core.module.Application
   * @extends aeris.builder.maps.core.module.Module
   *
   * @constructor
   * @override
   *
   * @param {Object} options
   *
   * @param {Marionette.Layout} options.layout
   * @param {Backbone.Router} options.router
   */
  var Application = function(options) {
    /**
     * Application layout
     *
     * @type {Marionette.Layout}
     * @protected
     */
    this.layout_ = options.layout;


    /**
     * Application router
     *
     * @type {aeris.builder.maps.core.router.StateRouter}
     * @protected
     */
    this.router_ = options.router;


    /**
     * Home, home on the DOM.
     * This is where our layout will be rendered.
     *
     * @type {jQuery}
     */
    this.$el;


    BaseModule.call(this, options);

    this.addInitializer(this.startHistory_);
  };
  _.inherits(Application, BaseModule);


  /**
   * Renders the application layout.
   *
   * @override
   *
   * @param {aeris.builder.options.AppBuilderOptions} builderOptions
   *        Builder options must provide either a jquery $el,
   *        or a plain jane element.
   *
   * @param {HTMLElement=} builderOptions.el
   * @param {jQuery=} builderOptions.$el
   */
  Application.prototype.render = function(builderOptions) {
    // Define the base map element
    // from our builder options
    this.$el = builderOptions.get('$el') || $(builderOptions.get('el'));

    // Render our  layout in the DOM
    this.$el.empty().append(this.layout_.$el);
  };


  /**
   * Startup backbone history.
   *
   * @protected
   */
  Application.prototype.startHistory_ = function() {
    Backbone.history.start();

    // Update route to match current state
    //this.router_.updateRoute();
  };


  return Application;
});
