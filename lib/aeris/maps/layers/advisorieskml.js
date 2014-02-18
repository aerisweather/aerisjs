define([
  'aeris/util',
  'aeris/maps/layers/kml'
], function(_, KML) {
  /**
   * Representation of Aeris Advisories.
   *
   * @constructor
   * @publicApi
   * @class AdvisoriesKML
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.KML
   */
  var AdvisoriesKML = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      url: 'http://gis.hamweather.net/kml/hwadv_all.kml',
      zIndex: 0,
      autoUpdateInterval: 1000 * 60 * 3
    }, opt_attrs);


    KML.call(this, attrs, opt_options);
  };
  _.inherits(AdvisoriesKML, KML);


  return _.expose(AdvisoriesKML, 'aeris.maps.layers.AdvisoriesKML');
});
