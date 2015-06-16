define([
  'aeris/util',
  'aeris/maps/layers/geojson',
  'aeris/api/collections/geojsonfeaturecollection'
], function(_, GeoJson, GeoJsonFeatureCollection) {
  /**
   * MultiPolygon layers showing severe weather advisory regions.
   *
   * @class SevereWarnings
   */
  var SevereWarnings = function(opt_attrs, opt_options) {
    var attrs = _.defaults(opt_attrs || {}, {
    });
    var options = _.defaults(opt_options || {}, {
      style: this.getStyle.bind(this),
      data: new GeoJsonFeatureCollection(null, {
        endpoint: 'advisories',
        action: 'search',
        params: {
          fields: [
            'details.type',
            'details.name',
            'details.body',
            'timestamps',
            'poly',
            'place'
          ],
          query: [
            {
              property: 'type',
              value: 'TO.W',
              operator: 'OR'
            },
            {
              property: 'type',
              value: 'SV.W',
              operator: 'OR'
            },
            {
              property: 'type',
              value: 'FF.W',
              operator: 'OR'
            }
          ]
        }
      })
    });

    GeoJson.call(this, attrs, options);
  };
  _.inherits(SevereWarnings, GeoJson);

  SevereWarnings.prototype.getStyle = function(properties) {
    var style = {
      stroke: true,
      weight: 3,
      color: '#038800',
      opacity: .8,
      fillOpacity: 0,
      fillColor: '#038800',
      hover: {
        weight: 4,
        fillOpacity: 0.5
      }
    };
    var typeStyles = {
      'TO.W': {
        color: '#FF0000',
        fillColor: '#FF0000'
      },
      'SV.W': {
        color: '#ffa500',
        fillColor: '#ffa500'
      },
      'FF.W': {
        color: '#00ff00',
        fillColor: '#00ff00',
        fillOpacity: 0.2
      }
    };
    var featureType = _.path('details.type', properties);

    if (typeStyles[featureType]) {
      return _.extend(style, typeStyles[featureType]);
    }

    return style;
  };

  return SevereWarnings;
});
