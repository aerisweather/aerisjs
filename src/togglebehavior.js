define([
  'aeris/util'
], function(_) {
  /**
   * A toggle-able model.
   *
   * Should only be mixed into {aeris.Model} object.
   *
   * @class aeris.ToggleBehavior
   * @extensionfor {aeris.Model}
   * @constructor
   */
  var ToggleBehavior = function() {
    /**
     * @attribute selected
     * @type {Boolean}
     * @default false
     */


    /**
     * @event select
     * @param {aeris.Model} model The selected model.
     */
    /**
     * @event deselect
     * @param {aeris.Model} model The deselected model.
     */
    /**
     * @event change:selected
     * @param {aeris.Model} model The selected or deselected model.
     * @param {Boolean} isSelected
     */

  };

  /**
   * @method initialize
   */
  ToggleBehavior.prototype.initialize = function() {
    if (!this.has('selected')) {
      this.set('selected', false);
    }

    this.bindToggleEvents_();
  };


  /**
   * @method bindToggleEvents_
   * @private
  */
  ToggleBehavior.prototype.bindToggleEvents_ = function() {
    this.listenTo(this, {
      'change:selected': function(model, value) {
        var topic = value ? 'select' : 'deselect';
        this.trigger(topic, model);
      }
    });
  };


  /**
   * Mark as selected.
   * @method select
   */
  ToggleBehavior.prototype.select = function() {
    this.set('selected', true);
  };


  /**
   * Mark as not selected.
   * @method deselect
   */
  ToggleBehavior.prototype.deselect = function() {
    this.set('selected', false);
  };


  /**
   * Toggle the selected attribute
   * @method toggle
   */
  ToggleBehavior.prototype.toggle = function() {
    this.set('selected', !this.get('selected'));
  };


  /**
   * @return {Boolean}
   * @method isSelected
   */
  ToggleBehavior.prototype.isSelected = function() {
    return this.get('selected');
  };


  return ToggleBehavior;
});
