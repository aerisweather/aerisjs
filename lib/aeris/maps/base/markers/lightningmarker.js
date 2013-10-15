define([
  'aeris/util',
  'base/markers/pointdatamarker'
], function(_, PointDataMarker) {
  /**
   * @class aeris.maps.markers.LightningMarker
   * @extends aeris.maps.markers.PointDataMarker
   * @constructor
   */
  var LightningMarker = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      url: _.config.path + 'assets/lightning_white.png'
    }, opt_attrs);

    PointDataMarker.call(this, attrs, opt_options);
  };
  _.inherits(LightningMarker, PointDataMarker);


  return LightningMarker;
});
