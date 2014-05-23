define([
  'aeris/util',
  'aeris/maps/animations/tileanimation'
], function(_, TileAnimation) {
  /**
   * An AutoUpdateAnimation is automatically updated
   * to to display the most current tiles available
   * from the Aeris API.
   *
   * The timespan (to - from) of an AutoUpdateAnimation
   * object will always remain constant.
   *
   * For example:
   *
   *    var animation = new AutoUpdateAnimation({
   *      from: 1PM_TODAY
   *      to: 3PM_TODAY
   *    });
   *
   *    // Some time passes...
   *    // Tiles become available for 4PM_TODAY
   *    animation.getTo();      // 4PM_TODAY
   *    animation.getFrom();    // 2PM_TODAY
   *
   * Note that as the animation range is updated, it will trigger
   * 'change:from' and 'change:to' events. This is useful if you need
   * UI components to reflect the range of the animation.
   *
   *    animation.on('change:from change:to', function() {
   *      $('#rangeInput').attr('min', animation.getFrom().getTime());
   *      $('#rangeInput').attr('max', animation.getFrom().getTime());
   *    });
   *
   * @class AutoUpdateAnimation
   * @namespace aeris.maps.animations
   * @extends aeris.maps.animations.TileAnimation
   *
   * @constructor
   */
  var AutoUpdateAnimation = function(masterLayer, opt_options) {
    TileAnimation.call(this, masterLayer, opt_options);


    this.bindToLayerAutoUpdate_();

    /**
     * @event autoUpdate
     */
  };
  _.inherits(AutoUpdateAnimation, TileAnimation);


  /**
   * @method bindToLayerAutoUpdate_
   * @private
   */
  AutoUpdateAnimation.prototype.bindToLayerAutoUpdate_ = function() {
    var updateInterval = this.masterLayer_.get('autoUpdateInterval');

    this.listenTo(this.masterLayer_, 'autoUpdate', function() {
      // Bump forward the animation by the autoUpdateInterval
      this.setTo(this.to_ + updateInterval);
      this.setFrom(this.from_ + updateInterval);

      // Reload layers with new interval
      this.loadAnimationLayers().
        done(this.trigger.bind(this, 'autoUpdate'));
    });
  };


  return AutoUpdateAnimation;
});
