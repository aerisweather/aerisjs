define(['aeris/util', './aerispolygons'], function(_) {

  /**
   * @fileoverview Representation of Aeris Convective Hazards layer.
   */


  _.provide('aeris.maps.layers.AerisConvectiveHazards');


  /**
   * Representation of Aeris Convective Hazards layer.
   *
   * @constructor
   * @extends {aeris.maps.layers.AerisPolygons}
   */
  aeris.maps.layers.AerisConvectiveHazards = function() {
    aeris.maps.layers.AerisPolygons.call(this);


    /**
     * @override
     */
    this.aerisPolygonType = 'convective/conhazo_day1';


    /**
     * @override
     */
    this.styles = {
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
    };

  };
  _.inherits(aeris.maps.layers.AerisConvectiveHazards,
                 aeris.maps.layers.AerisPolygons);


  return aeris.maps.layers.AerisConvectiveHazards;

});
