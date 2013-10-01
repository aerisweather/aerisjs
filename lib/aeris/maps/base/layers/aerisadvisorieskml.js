define([
  'aeris/util',
  'aeris/aerisapi',
  'base/layers/kml'
], function(_, AerisAPI, KML) {
  /**
   * Representation of Aeris Advisories.
   *
   * @constructor
   * @class aeris.maps.layers.AerisAdvisoriesKML
   * @extends {aeris.maps.layers.KML}
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
