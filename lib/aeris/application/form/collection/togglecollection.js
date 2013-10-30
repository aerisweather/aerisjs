define([
  'aeris/util',
  'aeris/collection',
  'application/form/model/toggle'
], function(_, Collection, Toggle) {
  /**
   * Collection of Toggle models.
   *
   * @class aeris.application.form.collection.ToggleCollection
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
   * @return {Array.<aeris.application.form.model.Toggle>} Selected Toggle  models.
   */
  ToggleCollection.prototype.getSelected = function() {
    return this.where({ selected: true });
  };


  return ToggleCollection;
});
