define([
  'aeris/util',
  'aeris/maps/animations/tileanimation'
], function(_, TileAnimation) {
  /**
   * An AutoUpdateAnimation is automatically updated
   * to to display the most recent tiles available
   * from the Aeris API.
   *
   * @class AutoUpdateAnimation
   * @namespace aeris.maps.animations
   * @extends aeris.maps.animations.TileAnimation
   *
   * @constructor
   * @override
   *
   * @param {aeris.maps.layers.AerisTile} masterLayer
   *
   * @param {Object=} opt_options
   * @param {number=} opt_options.limit The maximum number of time intervals to animate.
   * @param {number=} opt_options.timespan How far back from the current time to animate, in milliseconds.
   */
  var AutoUpdateAnimation = function(masterLayer, opt_options) {
    var options = _.defaults(opt_options || {}, {
      limit: 20,
      timespan: 1000 * 60 * 60 * 2   // 2 hours
    });

    options.to = Date.now();
    options.from = Date.now() - options.timespan;


    /**
     * @property timespan_
     * @private
     * @type {number} Milliseconds
     */
    this.timespan_ = options.timespan;


    TileAnimation.call(this, masterLayer, options);


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
    this.listenTo(this.masterLayer_, 'autoUpdate', function() {
      this.recalculateTimeBounds_();
      this.reloadAnimationLayers_();

      this.trigger('autoUpdate');
    });
  };


  /**
   * @method recalculateTimeBounds_
   * @private
   */
  AutoUpdateAnimation.prototype.recalculateTimeBounds_ = function() {
    this.setTo(Date.now());
    this.setFrom(this.to_ - this.timespan_);
  };


  /**
   * @method reloadAnimationLayers_
   * @private
   */
  AutoUpdateAnimation.prototype.reloadAnimationLayers_ = function() {
    this.animationLayerLoader_.setFrom(this.from_);
    this.animationLayerLoader_.setTo(this.to_);

    this.loadAnimationLayers();
  };


  return AutoUpdateAnimation;
});
