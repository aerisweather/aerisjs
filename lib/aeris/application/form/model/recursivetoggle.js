define([
  'aeris/util',
  'application/form/model/toggle',
  'application/form/collection/togglecollection',
  'aeris/classfactory'
], function(_, Toggle, ToggleCollection, ClassFactory) {
  /**
   * A RecursiveToggle
   * - is a type of Toggle model
   * - has a collection of RecursiveToggle models as an attribute
   *
   * @class aeris.application.form.collection.RecursiveToggle
   * @extends aeris.application.form.collection.ToggleCollection
   *
   * @constructor
   * @override
   *
   * @param {string} opt_options.childCollectionAttribute
   */
  var RecursiveToggle = function(opt_attrs, opt_options) {
    var attrs = opt_attrs || {};
    var options = _.defaults(opt_options || {}, {
      childCollectionAttribute: 'toggleCollection'
    });


    /**
     * Constructor options.
     *
     * @type {Object}
     * @private
     */
    this.options_ = options;

    /**
     * The attribute name of the nested collection.
     * @type {string}
     * @private
     */
    this.childCollectionAttribute_ = options.childCollectionAttribute;

    Toggle.call(this, attrs, options);
  };
  _.inherits(RecursiveToggle, Toggle);


  /**
   * @return {aeris.application.form.collection.ToggleCollection}
   *        Our collection of RecursiveToggle models.
   */
  RecursiveToggle.prototype.getChildCollection = function() {
    return this.get(this.childCollectionAttribute_);
  };


  /**
   * @override
   */
  RecursiveToggle.prototype.normalize_ = function(attrs) {
    // Convert childCollection plain array
    // to a RecusiveToggle collection
    if (_.isArray(attrs[this.childCollectionAttribute_])) {
      attrs[this.childCollectionAttribute_] = this.createChildCollection_(attrs[this.childCollectionAttribute_]);
    }

    return attrs;
  };


  /**
   * Create and return a nested child collection.
   * The collection's model will be bound to the same options
   * as the current model.
   *
   * @param {Array} opt_models Models to add to the collection.
   * @return {aeris.application.form.collection.ToggleCollection}
   * @private
   */
  RecursiveToggle.prototype.createChildCollection_ = function(opt_models) {
    var BoundRecursiveToggle = new ClassFactory(
      RecursiveToggle,
      [
        undefined,
        this.options_
      ],
      { extendArgObjects: true }
    );

    return new ToggleCollection(opt_models, {
      model: BoundRecursiveToggle
    });
  };

  return RecursiveToggle;
});
