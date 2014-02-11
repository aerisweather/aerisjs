define([
  'ai/util',
  'ai/application/form/collections/attributecollection',
  'ai/application/form/models/toggle'
], function(_, AttributeCollection, Toggle) {
  /**
   * Represents a collection of toggle attributes,
   * where only one attribute can be selected at a given time.
   *
   * @class RadioCollection
   * @namespace aeris.application.form.collections
   * @extends aeris.application.form.collections.AttributeCollection
   *
   * @constructor
   * @override
   */
  var RadioCollection = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      model: Toggle
    });
    /**
     * @property model
     * @type aeris.application.form.models.Toggle
     */

    AttributeCollection.call(this, opt_models, options);

    // Make sure one model is selected
    this.selectUnique();

    this.listenTo(this, {
      'select': function(model) {
        this.selectUnique(model);
      },
      'remove deselect': function() {
        this.selectUnique();
      },
      'add': function(model) {
        if (model.get('selected')) {
          this.selectUnique(model);
        }
      }
    });
  };
  _.inherits(RadioCollection, AttributeCollection);


  /**
   * Selects only the specified model,
   * and deselect all others.
   *
   * If no model is specified, selects the first selected model, or the first model
   *
   * @param {aeris.application.form.models.Toggle} opt_selectedModel Defaults to the first mode.
   * @method selectUnique
   */
  RadioCollection.prototype.selectUnique = function(opt_selectedModel) {
    var selectedModel;

    if (!this.length) {
      return;
    }

    selectedModel = opt_selectedModel || this.getSelected() || this.at(0);

    selectedModel.select();

    // Deselect all other models
    this.each(function(model) {
      if (model.cid !== selectedModel.cid) {
        model.deselect();
      }
    }, this);
  };


  /**
   * Returns the selected model.
   *
   * @return {aeris.application.form.models.Toggle}
   * @method getSelected
   */
  RadioCollection.prototype.getSelected = function() {
    return this.where({ selected: true })[0];
  };


  return RadioCollection;
});
