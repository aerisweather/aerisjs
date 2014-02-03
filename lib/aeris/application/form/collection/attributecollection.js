define([
  'ai/util',
  'ai/collection',
  'ai/application/form/model/attribute'
], function(_, Collection, Attribute) {
  /**
   * A collection of form attributes.
   *
   * @class AttributeCollection
   * @namespace aeris.application.form.collection
   * @extends aeris.Collection
   *
   * @constructor
   * @override
   */
  var AttributeCollection = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      model: Attribute
    });

    Collection.call(this, opt_models, options);
  };
  _.inherits(AttributeCollection, Collection);


  return AttributeCollection;
});
