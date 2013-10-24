define([
  'aeris/util',
  'application/form/collection/attributecollection',
  'application/form/model/toggle'
], function(_, AttributeCollection, Toggle) {
  /**
   * Represents a collection of toggle attributes,
   * where only one attribute can be selected at a given time.
   *
   * @class aeris.application.form.collection.RadioCollection
   * @extends aeris.application.form.collection.AttributeCollection
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
     * @type aeris.application.form.model.Toggle
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
   * @param {aeris.application.form.model.Toggle} opt_selectedModel Defaults to the first mode.
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
   * @return {aeris.application.form.model.Toggle}
   */
  RadioCollection.prototype.getSelected = function() {
    return this.where({ selected: true })[0];
  };


  return RadioCollection;
});
