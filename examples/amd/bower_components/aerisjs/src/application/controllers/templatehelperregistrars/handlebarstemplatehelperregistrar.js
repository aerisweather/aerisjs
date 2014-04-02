define([
  'aeris/util',
  'aeris/errors/invalidargumenterror'
], function(_, InvalidArgumentError) {
  /**
   * @class HandlebarsTemplateHelperRegistrar
   * @namespace aeris.application.controllers.templatehelperregistrars
   * @implements aeris.application.controllers.templatehelperregistrars.TemplateHelperRegistrarInterface
   *
   * @constructor
   * @override
   */
  var HandlebarsTemplateHelperRegistrar = function(template, helpers) {
    this.templateFn_;
    this.helpers_;

    if (template) {
      this.setTemplate(template);
    }
    if (helpers) {
      this.setHelpers(helpers);
    }
  };

  /**
   * @override
   * @throws {aeris.errors.InvalidArgumentError}
   * @method getTemplateWithHelpers
   */
  HandlebarsTemplateHelperRegistrar.prototype.getTemplateWithHelpers = function() {
    var templateFn, helpers, wrappedTemplateFn;

    this.ensureTemplateAndHelpersExist_();

    templateFn = this.templateFn_;
    helpers = this.helpers_;

    wrappedTemplateFn = function(data) {
      return templateFn(data, { helpers: helpers });
    };

    return wrappedTemplateFn;
  };


  /**
   * @override
   * @throws {aeris.errors.InvalidArgumentError}
   * @method getTemplateWithHelpersBoundTo
   */
  HandlebarsTemplateHelperRegistrar.prototype.getTemplateWithHelpersBoundTo = function(ctx) {
    this.bindHelpersTo_(ctx);
    return this.getTemplateWithHelpers();
  };


  /**
   * @param {Object.<string,Function>} helpers
   * @param {Object} ctx
   * @private
   * @method bindHelpersTo_
   */
  HandlebarsTemplateHelperRegistrar.prototype.bindHelpersTo_ = function(ctx) {
    _.each(this.helpers_, function(helperMethod, helperName) {
      this.helpers_[helperName] = _.bind(helperMethod, ctx);
    }, this);
  };


  /**
   * @private
   * @throws {aeris.errors.InvalidArgumentError}
   * @method ensureTemplateAndHelpersExist_
   */
  HandlebarsTemplateHelperRegistrar.prototype.ensureTemplateAndHelpersExist_ = function() {
    if (!this.templateFn_ || !this.helpers_) {
      throw new InvalidArgumentError('Template or template helpers must be defined.');
    }
  };


  /**
   * @method setTemplate
   */
  HandlebarsTemplateHelperRegistrar.prototype.setTemplate = function(templateFn) {
    this.ensureValidTemplate_(templateFn);

    this.templateFn_ = templateFn;
  };


  /**
   * @method setHelpers
   */
  HandlebarsTemplateHelperRegistrar.prototype.setHelpers = function(helpers) {
    this.ensureValidHelpers_(helpers);

    this.helpers_ = helpers;
  };


  /**
   * @param {string|Function} template
   * @throws {aeris.errors.InvalidArgumentError}
   * @method ensureValidTemplate_
   */
  HandlebarsTemplateHelperRegistrar.prototype.ensureValidTemplate_ = function(template) {
    this.ensureIsFunction_(template);
  };


  /**
   * @param {Object.<string,Function>} helpers
   * @throws {aeris.errors.InvalidArgumentError}
   * @private
   * @method ensureValidHelpers_
   */
  HandlebarsTemplateHelperRegistrar.prototype.ensureValidHelpers_ = function(helpers) {
    var isPlainObject = _.isObject(helpers) && !_.isFunction(helpers) && !_.isArray(helpers);

    if (!isPlainObject) {
      throw new InvalidArgumentError('Expect a hash of helper methods. Instead got ' + helpers);
    }

    _.each(helpers, this.ensureIsFunction_, this);
  };


  /**
   * @param {Function} fn
   * @throws {aeris.errors.InvalidArgumentError}
   * @private
   * @method ensureIsFunction_
   */
  HandlebarsTemplateHelperRegistrar.prototype.ensureIsFunction_ = function(fn) {
    if (!_.isFunction(fn)) {
      throw new InvalidArgumentError(fn + ' is not valid template or helper function.');
    }
  };


  return HandlebarsTemplateHelperRegistrar;
});
