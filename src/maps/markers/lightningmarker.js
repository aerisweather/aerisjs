define([
  'aeris/util',
  'aeris/config',
  'aeris/maps/markers/pointdatamarker'
], function(_, config, PointDataMarker) {
  /**
   * @publicApi
   * @class LightningMarker
   * @namespace aeris.maps.markers
   * @extends aeris.maps.markers.PointDataMarker
   * @constructor
   */
  var LightningMarker = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      url: config.get('assetPath') + 'lightning_white.png'
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
