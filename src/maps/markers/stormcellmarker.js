define([
  'aeris/util',
  'aeris/maps/extensions/mapextensionobject'
], function(_, MapExtensionObject) {
  /** @class StormCellMarker */
  var StormCellMarker = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      // StormCellMarkers may currently only be
      // rendered as a MarkerCollection (not as individual markers)
      strategy: _.noop
    });
    MapExtensionObject.call(this, opt_attrs, options);
  };
  _.inherits(StormCellMarker, MapExtensionObject);


  return StormCellMarker;
});
