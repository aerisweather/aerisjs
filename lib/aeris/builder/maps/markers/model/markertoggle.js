define([
  'aeris/util',
  'application/form/model/toggle',
  'application/form/collection/togglecollection'
], function(_, Toggle, ToggleCollection) {
  /**
   *
   * @class aeris.builder.maps.markers.model.MarkerToggle
   * @extends aeris.application.form.model.Toggle
   *
   * @constructor
   * @override
   */
  var MarkerToggle = function(opt_attrs, opt_options) {
    /**
     * @attribute filters
     * @type {aeris.application.form.collection.ToggleCollection}
     */
    /**
     * @attribute state
     * @type {aeris.builder.maps.core.model.MapObjectState}
     */

    /**
     * @event select:filter
     * @param {aeris.application.form.model.Toggle} filter
     */
    /**
     * @event deselect:filter
     * @param {aeris.application.form.model.Toggle} filter
     */

    var attrs = _.defaults(opt_attrs || {}, {
      filters: new ToggleCollection()
    });

    Toggle.call(this, attrs, opt_options);


    // Bubble filters select event
    this.listenTo(this.get('filters'), {
      'select': function(filter) {
        this.trigger('select:filter', filter);
      },
      'deselect': function(filter) {
        this.trigger('deselect:filter', filter);
      }
    });
  };
  _.inherits(MarkerToggle, Toggle);


  /**
   * Normalize filters as a ToggleCollection
   *
   * @override
   */
  MarkerToggle.prototype.normalize_ = function(attrs) {
    attrs = Toggle.prototype.normalize_.apply(this, arguments);

    // Set filters array
    // on our filter collection
    if (_.isArray(attrs.filters)) {
      attrs.filters = this.get('filters').set(attrs);
    }

    return attrs;
  };


  return MarkerToggle;
});
