define([
  'aeris/util',
  'aeris/builder/options/appbuilderoptions'
], function(_, AppBuilderOptions) {

  /**
   *
   * @param {Object=} opt_options Options accepted by {AppBuilderOptions}.
   * @param {AppBuilderOptions} opt_optionsClass
   *                            AppBuilderOptions class used to
   *                            create options.
   * @class
   * @constructor
   */
  var AppBuilder = function(opt_options, opt_optionsClass) {
    var OptionsClass = opt_optionsClass || AppBuilderOptions;

    this.options_ = new OptionsClass(opt_options);
  };


  /**
   * Get a named option.
   *
   * @param {string} prop
   * @return {*}
   */
  AppBuilder.prototype.getOption = function(prop) {
    return this.options_.get(prop);
  };

  return AppBuilder;
});
