define([
  'aeris/util'
], function(_) {
  /**
   * A collection of {aeris.ToggleBehavior} models.
   *
   * Should only be mixed into {aeris.Collection} objects.
   *
   * @class ToggleCollectionBehavior
   * @namespace aeris
   * @extensionfor {aeris.Collection}
   *
   * @constructor
   */
  var ToggleCollectionBehavior = function() {
  };

  /**
   * Select all models in the collection.
   *
   * @method selectAll
  */
  ToggleCollectionBehavior.prototype.selectAll = function() {
    this.invoke('select');
  };

  /**
   * Deselect all models in the collection.
   *
   * @method deselectAll
  */
  ToggleCollectionBehavior.prototype.deselectAll = function() {
    this.invoke('deselect');
  };


  /**
   * Toggle whether each model in the collection is selected.
   *
   * @method toggleAll
  */
  ToggleCollectionBehavior.prototype.toggleAll = function() {
    this.invoke('toggle');
  };


  /**
   * Selects the specified model,
   * and deselects all others in the collection.
   *
   * @method selectOnly
   * @param {aeris.Model} modelToSelect
  */
  ToggleCollectionBehavior.prototype.selectOnly = function(modelToSelect) {
    // Note that deselecting all models
    // (including the modelToSelect)
    // would cause an extra event to fire on
    // the modelToSelect, in the case that
    // it is already selected.
    this.each(function(model) {
      if (model !== modelToSelect) {
        model.deselect();
      }
    });

    modelToSelect.select();
  };


  /**
   * @method getSelected
   * @return {Array.<aeris.Model>}
  */
  ToggleCollectionBehavior.prototype.getSelected = function() {
    return this.filter(function(model) {
      return model.isSelected();
    }, this);
  };


  /**
   * @method getDeselected
   * @return {Array.<aeris.Model>}
  */
  ToggleCollectionBehavior.prototype.getDeselected = function() {
    return this.filter(function(model) {
      return !model.isSelected();
    }, this);
  };


  return ToggleCollectionBehavior;
});
