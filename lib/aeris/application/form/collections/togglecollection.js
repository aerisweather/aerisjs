define([
  'ai/util',
  'ai/collection',
  'ai/application/form/models/toggle'
], function(_, Collection, Toggle) {
  /**
   * Collection of Toggle models.
   *
   * @class ToggleCollection
   * @namespace aeris.application.form.collections
   * @extends aeris.Collection
   *
   * @constructor
   * @override
   */
  var ToggleCollection = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      model: Toggle
    });

    Collection.call(this, opt_models, options);
  };
  _.inherits(ToggleCollection, Collection);


  /**
   * @return {Array.<aeris.application.form.models.Toggle>} Selected Toggle  models.
   * @method getSelected
   */
  ToggleCollection.prototype.getSelected = function() {
    return this.where({ selected: true });
  };


  return ToggleCollection;
});
