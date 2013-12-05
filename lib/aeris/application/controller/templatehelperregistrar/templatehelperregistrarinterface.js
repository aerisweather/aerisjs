define(function() {
  /**
   * Assists in the registration of
   * helper methods for a template.
   *
   * @param {string|Function=} opt_template
   * @param {Object.<string,Function>=} opt_helpers
   *
   * @class aeris.application.controller.templatehelperregistrar.TemplateHelperRegistrarInterface
   * @interface
   *
   * @constructor
   */
  var TemplateHelperRegistrar = function(opt_template, opt_helpers) {};


  /**
   * @return {Function} Template function with helpers.
   */
  TemplateHelperRegistrar.prototype.getTemplateWithHelpers = function() {};


  /**
   * @param {Object} context
   *
   * @return {Function}
   *         Template function with helpers.
   *         Helpers are bound to the provided context.
   */
  TemplateHelperRegistrar.prototype.getTemplateWithHelpersBoundTo = function(context) {};


  /**
   * @param {string|Function} template
   */
  TemplateHelperRegistrar.prototype.setTemplate = function(template) {};


  /**
   * @param {Object.<string,Function>} helpers
   */
  TemplateHelperRegistrar.prototype.setHelpers = function(helpers) {};


  return TemplateHelperRegistrar;
});