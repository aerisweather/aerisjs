define([
  'aeris/util',
  'mapbuilder/core/model/mapobjectstate'
], function(_, MapObjectState) {
  /**
   * State of a {aeris.maps.layers.AbstractTile} object
   *
   * @class aeris.builder.maps.core.model.LayerState
   * @extends aeris.builder.maps.core.model..MapObjectState
   *
   * @constructor
   * @override
   */
  var LayerState = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      namespace: 'aeris.maps.layers'
    });

    MapObjectState.call(this, opt_attrs, options);
  };
  _.inherits(LayerState, MapObjectState);


  return LayerState;
});
