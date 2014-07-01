define([
  'aeris/util',
  'aeris/config',
  'aeris/maps/markers/pointdatamarker',
  'aeris/maps/markers/config/iconlookup'
], function(_, config, PointDataMarker, iconLookup) {
  var lightningStyles = iconLookup.lightning;
  /**
   * @publicApi
   * @class LightningMarker
   * @namespace aeris.maps.markers
   * @extends aeris.maps.markers.PointDataMarker
   * @constructor
   */
  var LightningMarker = function(opt_attrs, opt_options) {
    PointDataMarker.call(this, opt_attrs, opt_options);
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


  /**
   * @method lookupUrl_
   * @private
   */
  LightningMarker.prototype.lookupUrl_ = function() {
    return this.lookupIconStyles_().url;
  };


  /**
   * @method lookupOffsetX_
   * @private
   */
  LightningMarker.prototype.lookupOffsetX_ = function() {
    return this.lookupIconStyles_().offsetX;
  };


  /**
   * @method lookupOffsetY_
   * @private
   */
  LightningMarker.prototype.lookupOffsetY_ = function() {
    return this.lookupIconStyles_().offsetY;
  };


  /**
   * @method lookupIconStyles_
   * @private
   */
  LightningMarker.prototype.lookupIconStyles_ = function() {
    var lightningTimeAgo = Date.now() - this.getDataAttribute('obTimestamp') * 1000;
    var times = Object.keys(lightningStyles).sort();
    var styles = lightningStyles[times[0]];

    times.forEach(function(minutes) {
      var styleTime = parseInt(minutes) * 60 * 1000;

      if (lightningTimeAgo <= styleTime) {
        styles = lightningStyles[minutes];
      }
    });

    return styles;
  };


  return _.expose(LightningMarker, 'aeris.maps.markers.LightningMarker');
});
