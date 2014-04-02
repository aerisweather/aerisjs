define(function() {
  /**
   * Assists in the registration of
   * helper methods for a template.
   *
   * @param {string|Function=} opt_template
   * @param {Object.<string,Function>=} opt_helpers
   *
   * @class TemplateHelperRegistrarInterface
   * @namespace aeris.application.controllers.templatehelperregistrars
   * @interface
   *
   * @constructor
   */
  var TemplateHelperRegistrar = function(opt_template, opt_helpers) {};


  /**
   * @return {Function} Template function with helpers.
   * @method getTemplateWithHelpers
   */
  TemplateHelperRegistrar.prototype.getTemplateWithHelpers = function() {};


  /**
   * @param {Object} context
   *
   * @return {Function}
   *         Template function with helpers.
   *         Helpers are bound to the provided context.
   * @method getTemplateWithHelpersBoundTo
   */
  TemplateHelperRegistrar.prototype.getTemplateWithHelpersBoundTo = function(context) {};


  /**
   * @param {string|Function} template
   * @method setTemplate
   */
  TemplateHelperRegistrar.prototype.setTemplate = function(template) {};


  /**
   * @param {Object.<string,Function>} helpers
   * @method setHelpers
   */
  TemplateHelperRegistrar.prototype.setHelpers = function(helpers) {};


  return TemplateHelperRegistrar;
});
