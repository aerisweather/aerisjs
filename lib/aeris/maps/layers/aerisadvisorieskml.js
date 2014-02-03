define([
  'ai/util',
  'ai/maps/layers/kml'
], function(_, KML) {
  /**
   * Representation of Aeris Advisories.
   *
   * @constructor
   * @publicApi
   * @class AerisAdvisoriesKML
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.KML
   */
  var AerisAdvisoriesKML = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      url: 'http://gis.hamweather.net/kml/hwadv_all.kml',
      zIndex: 0,
      autoUpdateInterval: 1000 * 60 * 3
    }, opt_attrs);


    KML.call(this, attrs, opt_options);
  };
  _.inherits(AerisAdvisoriesKML, KML);


  return _.expose(AerisAdvisoriesKML, 'aeris.maps.layers.AerisAdvisoriesKML');

});
