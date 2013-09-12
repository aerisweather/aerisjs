define([
  'aeris/util',
  'aeris/aerisapi',
  './kml'
], function(_, AerisAPI, KML) {


  /**
   * Representation of Aeris Advisories.
   *
   * @constructor
   * @class aeris.maps.layers.AerisAdvisoriesKML
   * @extends {aeris.maps.layers.KML}
   */
  var AerisAdvisoriesKML = function() {
    KML.call(this);


    /**
     * @override
     */
    this.url = 'http://gis.hamweather.net/kml/hwadv_all.kml';


    /**
     * @override
     */
    this.zIndex = 0;


    /**
     * @override
     */
    this.autoUpdateInterval = 1000 * 60 * 3;

  };
  _.inherits(AerisAdvisoriesKML, KML);


  return _.expose(AerisAdvisoriesKML, 'aeris.maps.layers.AerisAdvisoriesKML');

});
