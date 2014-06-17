define([
  'aeris/util',
  'aeris/config',
  'aeris/maps/markers/pointdatamarker',
  'aeris/maps/markers/config/iconlookup'
], function(_, config, PointDataMarker, iconLookup) {
  /**
   * @publicApi
   * @class LightningMarker
   * @namespace aeris.maps.markers
   * @extends aeris.maps.markers.PointDataMarker
   * @constructor
   */
  var LightningMarker = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      url: iconLookup.lightning.defaultStyles.url,
      offsetX: iconLookup.lightning.defaultStyles.offsetX,
      offsetY: iconLookup.lightning.defaultStyles.offsetY
    }, opt_attrs);

    PointDataMarker.call(this, attrs, opt_options);
  };
  _.inherits(LightningMarker, PointDataMarker);


  /**
   * @override
   * @method lookupTitle_
   * @protected
   */
  LightningMarker.prototype.lookupTitle_ = function() {
    return 'Lightning';
  };


  return _.expose(LightningMarker, 'aeris.maps.markers.LightningMarker');
});
