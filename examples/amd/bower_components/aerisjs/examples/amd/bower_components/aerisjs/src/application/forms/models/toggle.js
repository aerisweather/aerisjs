define([
  'aeris/util',
  'aeris/application/forms/models/attribute',
  'aeris/togglebehavior'
], function(_, Attribute, ToggleBehavior) {
  /**
   * Represents a toggle-able form item.
   *
   * @class Toggle
   * @namespace aeris.application.forms.models
   * @extends aeris.application.forms.models.Attribute
   * @uses aeris.ToggleBehavior
   *
   * @constructor
   * @override
   */
  var Toggle = function(opt_attrs, opt_options) {
    /**
     * @attribute selected
     * @type {Boolean}
     * @default false
     */

    var attrs = _.defaults(opt_attrs || {}, {
      selected: false
    });

    Attribute.call(this, attrs, opt_options);
    ToggleBehavior.call(this);
  };
  _.inherits(Toggle, Attribute);
  _.extend(Toggle.prototype, ToggleBehavior.prototype);


  return Toggle;
});
