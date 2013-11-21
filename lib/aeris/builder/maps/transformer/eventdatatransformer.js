define([
  'aeris/util'
], function(_) {
  /**
   * Transforms parameters emitted with events
   * into usable data.
   *
   * @class aeris.builder.maps.transformer.eventDataTransformer
   * @static
   */
  return {
    /**
     * Transforms 'marker:click' event,
     * where the second param is the marker object.
     *
     * @param {Array.<number>} latLon
     * @param {aeris.maps.Marker} marker
     * @return {Array.<aeris.Model>} Data associated with the marker.
     */
    markerClick: function(latLon, marker) {
      return marker.getData();
    },

    /**
     * Return the map from
     * a 'map:set' event.
     *
     * @param {aeris.maps.extension.MapObjectInterface} mapObject
     * @param {aeris.maps.Map} map
     * @param {Object} options
     *
     * @return {Array.<aeris.maps.Map>}
     */
    mapSet: function(mapObject, map, options) {
      return map;
    },


    /**
     * Return JSON data from
     * a 'sync' event.
     *
     * @param {aeris.Model} model
     * @param {*} res API response object.
     * @param {Object} options
     *
     * @return {Array.<Object>}
     */
    syncToJSON: function(model, res, options) {
      return model.toJSON();
    }
  }
});
