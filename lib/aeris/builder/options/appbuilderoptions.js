define([
  'aeris/util',
  'aeris/model'
], function(_, BaseModel) {
  /**
   * @typedef {Object} AppBuilderOptions
   *
   * @property {Function} onload
   *                      A function to call when the application
   *                      is sucessfully loaded.
   *
   * @property {Function} onerror
   *                      A function to call if the application builder
   *                      encounters errors when loading.
   */

  /**
   * Configuration options for an {aeris.AppBuilder}
   *
   * @class aeris.builder.options.AppBuilderOptions
   * @extends aeris.Model
   *
   * @constructor
   * @override
   *
   * @param {Object} opt_options.defaults
   */
  var AppBuilderOptions = function(opt_attrs, opt_options) {
    var options;

    opt_options || (opt_options = {});

    options = _.defaults(opt_options, {
      defaults: _.defaults(opt_options.defaults || {}, {
        onload: function() {},
        onerror: function() {}
      })
    });

    /**
     * Defaults set via Backbone Model logic.
     *
     * @override
     * @type {Object}
     */
    this.defaults = options.defaults;


    BaseModel.call(this, opt_attrs, options);

    // Force validation
    this.listenTo(this, 'change', function() {
      this.isValid();
    });
  };
  _.inherits(AppBuilderOptions, BaseModel);


  return AppBuilderOptions;
});
