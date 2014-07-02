define([
  'aeris/util',
  'aeris/config',
  'aeris/maps/markers/pointdatamarker',
  'aeris/maps/markers/config/iconlookup',
  'aeris/util/findclosest'
], function(_, config, PointDataMarker, iconLookup, findClosest) {
  var lightningStyles = iconLookup.lightning;
  /**
   * @publicApi
   * @class LightningMarker
   * @namespace aeris.maps.markers
   * @extends aeris.maps.markers.PointDataMarker
   * @constructor
   */
  var LightningMarker = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      iconLookup: lightningStyles
    });

    PointDataMarker.call(this, opt_attrs, options);
  };
  _.inherits(LightningMarker, PointDataMarker);


  /**
   * @method lookupType_
   * @private
   */
  LightningMarker.prototype.lookupType_ = function() {
    var styleTimes, lightningTimeAgo, lightningTimeAgo_minutes;
    styleTimes = Object.keys(this.iconLookup_).sort();

    if (!this.getDataAttribute('obTimestamp')) {
      return _.last(styleTimes);
    }

    lightningTimeAgo = Date.now() - this.getDataAttribute('obTimestamp') * 1000;
    lightningTimeAgo_minutes = lightningTimeAgo / (1000 * 60);


    var matchingStyleTime = styleTimes.reduceRight(function(matchingStyleTime, maxMinutesAgo) {
        maxMinutesAgo = parseInt(maxMinutesAgo);

        if (lightningTimeAgo_minutes <= maxMinutesAgo) {
          return maxMinutesAgo;
        }
        else {
          return matchingStyleTime;
        }
      }, styleTimes[0]);

    return parseInt(matchingStyleTime);
  };


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
