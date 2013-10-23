define([
  'aeris/util',
  'aeris/collection',
  'mapbuilder/core/model/toggle'
], function(_, BaseCollection, Toggle) {
  /**
   * A collection of {aeris.builder.maps.core.model.Toggle} models.
   *
   * @class aeris.builder.maps.core.collection.ToggleCollection
   * @extends aeris.Collection
   */
  var ToggleCollection = function(opt_models, opt_options) {
    var options = _.extend({
      model: Toggle
    }, opt_options);

    BaseCollection.call(this, opt_models, options);
  };
  _.inherits(ToggleCollection, BaseCollection);


  return ToggleCollection;
});
