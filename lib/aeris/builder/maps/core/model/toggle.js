define([
  'aeris/util',
  'aeris/model',
  'aeris/errors/validationerror'
], function(_, BaseModel, ValidationError) {
  /**
   * Clap-on...
   * Clap-off..
   * Clap-on, clap-off, clap-on...
   *
   * A toggle is a thing which can be toggled on and off.
   *
   * @param {Object=} opt_options
   * @param {Boolean=} opt_options.autoLabel
   *        If true, model will automatically set the label attribute
   *        to a 'parsed' version of the name. The label will only be set
   *        if no label is already defined.
   *
   *        Parsing will change:
   *          camelCase-Names_willBeParsed
   *        To:
   *          Camel Case Names Will Be Parsed
   *
   * @class aeris.builder.maps.core.model.Toggle
   * @extends aeris.Model
   * @constructor
   */
  var Toggle = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      /**
       * @attribute name
       * @type {string}
       */

      /**
       * @attribute
       * @type {string}
       */
    }, opt_attrs);

    var options = _.extend({
      autoLabel: true
    }, opt_options);

    BaseModel.call(this, attrs, options);


    /**
     * Constructor options.
     *
     * @type {Object}
     * @private
     */
    this.options_ = options;


    // Run autoLabel on init
    if (options.autoLabel) {
      this.autoLabel();
    }

    // Force validation in init
    this.isValid();

    this.listenTo(this, {
      // Auto label
      'change:name': function() {
        if (!this.get('label') && this.options_.autoLabel) {
          this.autoLabel();
        }
      },

      // Force validation on change
      change: function() {
        this.isValid();
      },


      /**
       * @event select
       * @param {aeris.builder.maps.core.model.Toggle} model
       */
      /**
       * @event deselect
       * @param {aeris.builder.maps.core.model.Toggle} model
       */
      'change:selected': function(model, value, options) {
        var topic = value ? 'select' : 'deselect';
        this.trigger(topic, model);
      }
    });


  };
  _.inherits(Toggle, BaseModel);


  /**
   * @override
   */
  Toggle.prototype.validate = function(attrs) {
    if (!_.isString(attrs.name)) {
      return new ValidationError('name', attrs.name + ' is not a valid string');
    }
    if (!_.isString(attrs.label) && !this.options_.autoLabel) {
      return new ValidationError('label', attrs.label + ' is not a valid string');
    }
  };


  /**
   * Sets the label to a parsed version
   * of the `name` attribute.
   *
   *   Parsing will change:
   *     camelCase-Names_WillBeParsed
   *
   *   To:
   *     Camel Case Names Will Be Parsed
   */
  Toggle.prototype.autoLabel = function() {
    // Get a safe copy of our name
    var label, words;

    // Don't overwrite existing label.
    if (this.get('label')) { return; }

    // Check for valid name
    this.isValid();

    label = this.get('name').slice(0);

    var capitalize = function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // Split up camelCase names
    label = label.charAt(0).toLowerCase() + label.slice(1);
    label = label.replace(/([A-Z])/g, ' $1');
    label = capitalize(label);

    // Replace '-' and '_' with spaces
    label = label.replace(/([-|_])/g, ' ');

    // Trim
    label = label.replace(/\s\s/g, ' ');

    // Capitalize all words
    words = label.split(' ');
    _.each(words, function(str, n) {
      words[n] = capitalize(str);
    });

    label = words.join(' ');

    this.set('label', label);
  };


  /**
   * Mark as selected.
   */
  Toggle.prototype.select = function() {
    this.set('selected', true);
  };


  /**
   * Mark as not selected.
   */
  Toggle.prototype.deselect = function() {
    this.set('selected', false);
  };


  return Toggle;
});
