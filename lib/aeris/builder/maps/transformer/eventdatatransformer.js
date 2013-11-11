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
     * @param {Array} evtParams
     * @returns {Array.<aeris.Model>} Data associated with the marker.
     */
    markerClick: function(evtParams) {
      var markerObj = evtParams[1];

      return [markerObj.get('data')];
    }
  }
});
