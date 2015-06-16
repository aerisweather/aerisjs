define([
  'aeris/util',
  'aeris/maps/layers/geojson',
  'aeris/api/collections/geojsonfeaturecollection'
], function(_, GeoJson, GeoJsonFeatureCollection) {
  /**
   * MultiPolygon layer showing regions which contain storm cells.
   *
   * @class StormCellSummary
   */
  var StormCellSummary = function(opt_attrs, opt_options) {
    var attrs = _.defaults(opt_attrs || {}, {
      clickable: false,
      style: {
        stroke: true,
        color: '#030303',
        weight: 1,
        opacity: .8,
        fillColor: 'orange',
        fillOpacity: 0.4
      }
    });
    var options = _.defaults(opt_options || {}, {
      data: new GeoJsonFeatureCollection(null, {
        endpoint: 'stormcells',
        action: 'summary',
        params: {
          filter: [
            {
              name: 'threat',
              operator: 'AND'
            },
            {
              name: 'geo',
              operator: 'AND'
            }
          ]
        }
      })
    });

    GeoJson.call(this, attrs, options);
  };
  _.inherits(StormCellSummary, GeoJson);

  return _.expose(StormCellSummary, 'aeris.maps.layers.StormCellSummary');
});
