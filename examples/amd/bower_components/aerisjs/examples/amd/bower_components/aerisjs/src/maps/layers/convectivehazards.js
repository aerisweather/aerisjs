define([
  'aeris/util',
  'aeris/maps/layers/aerispolygons'
], function(_, AerisPolygons) {
  /**
   * Representation of Aeris Convective Hazards layer.
   *
   * @constructor
   * @publicApi
   * @class ConvectiveHazards
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisPolygons
   */
  var ConvectiveHazards = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      aerisPolygonType: 'convective/conhazo_day1',
      styles: {
        2: {
          fillColor: '#afad24',
          fillOpacity: 0.5,
          strokeColor: '#afad24',
          strokeOpacity: 1,
          strokeWeight: 2
        },
        4: {
          fillColor: '#dd8700',
          fillOpacity: 0.5,
          strokeColor: '#dd8700',
          strokeOpacity: 1,
          strokeWeight: 2
        },
        6: {
          fillColor: '#d90000',
          fillOpacity: 0.5,
          strokeColor: '#d90000',
          strokeOpacity: 1,
          strokeWeight: 2
        },
        8: {
          fillColor: '#ff46ae',
          fillOpacity: 0.5,
          strokeColor: '#ff46ae',
          strokeOpacity: 1,
          strokeWeight: 2
        }
      }
    }, opt_attrs);

    AerisPolygons.call(this, attrs, opt_options);
  };
  _.inherits(ConvectiveHazards, AerisPolygons);


  return _.expose(ConvectiveHazards, 'aeris.maps.layers.ConvectiveHazards');
});
