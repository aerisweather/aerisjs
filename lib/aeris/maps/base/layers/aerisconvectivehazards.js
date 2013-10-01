define([
  'aeris/util',
  'base/layers/aerispolygons'
], function(_, AerisPolygons) {
  /**
   * Representation of Aeris Convective Hazards layer.
   *
   * @constructor
   * @class aeris.maps.layers.AerisConvectiveHazards
   * @extends aeris.maps.layers.AerisPolygons
   */
  var AerisConvectiveHazards = function(opt_attrs, opt_options) {
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
  _.inherits(AerisConvectiveHazards, AerisPolygons);


  return _.expose(AerisConvectiveHazards, 'aeris.maps.layers.AerisConvectiveHazards');
});
