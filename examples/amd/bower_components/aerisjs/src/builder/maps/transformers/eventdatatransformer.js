define([
  'aeris/util'
], function(_) {
  /**
   * Transforms parameters emitted with events
   * into usable data.
   *
   * @class eventDataTransformer
   * @namespace aeris.builder.maps.transformers
   * @static
   */
  return {
    /**
     * Transforms 'marker:click' event,
     * where the second param is the marker object.
     *
     * @param {aeris.maps.LatLon} latLon
     * @param {aeris.maps.markers.Marker} marker
     * @return {Array.<aeris.Model>} Data associated with the marker.
     * @method markerClick
     */
    markerClick: function(latLon, marker) {
      return marker.getData();
    },


    /**
     * Transforms a click event on
     * a view model into JSON data.
     *
     * @param {aeris.maps.LatLon} latLon
     * @param {aeris.ViewModel} viewModel
     * @return {Object}
     * @method clickToJSON
     */
    clickToJSON: function(latLon, viewModel) {
      return viewModel.getData().toJSON();
    },

    /**
     * Return the map from
     * a 'map:set' event.
     *
     * @param {aeris.maps.extensions.MapObjectInterface} mapObject
     * @param {aeris.maps.Map} map
     * @param {Object} options
     *
     * @return {Array.<aeris.maps.Map>}
     * @method mapSet
     */
    mapSet: function(mapObject, map, options) {
      return map;
    },


    /**
     * Return JSON data from
     * an event whose first parameter
     * is a model.
     *
     * @param {aeris.Model} model
     *
     * @return {Array.<Object>}
     * @method modelToJSON
     */
    modelToJSON: function(model) {
      return model.toJSON();
    }
  };
});
