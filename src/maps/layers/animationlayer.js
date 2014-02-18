define([
  'aeris/util',
  'aeris/maps/layers/layer'
], function(_, BaseLayer) {
  /**
   * An animation layer is a layer
   * which can be animated.
   *
   * @constructor
   * @class AnimationLayer
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.Layer
   */
  var AnimationLayer = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      /**
       * Milliseconds between an autoupdate of the data.
       *
       * @attribute autoUpdateInterval
       * @type {number}
       * @default 6000 (1 second)
       */
      autoUpdateInterval: 1000 * 60
    }, opt_attrs);


    BaseLayer.call(this, attrs, opt_options);
  };

  _.inherits(AnimationLayer, BaseLayer);


  /**
   * Experimental layer fade animation.
   *
   * @param {number} targetOpacity
   * @param {number} duration In milliseconds.
   * @method fadeTo
   */
  AnimationLayer.prototype.fadeTo = function(targetOpacity, duration) {
    var direction = this.get('opacity') > targetOpacity ? -1 : 1;
    var spread = Math.abs(this.get('opacity') - targetOpacity);
    var interval = 13;
    var framesCount = duration / interval;
    var delta = spread / framesCount;

    this.stop();

    this.animationClock_ = window.setInterval(
      _.bind(function() {
        var nextOpacity = this.get('opacity') + (delta * direction);

        if (nextOpacity < 0 || nextOpacity > 1) {
          this.setOpacity(targetOpacity);
          window.clearInterval(this.animationClock_);
          return;
        }
        this.setOpacity(nextOpacity);

        if (direction === -1 && this.get('opacity') <= targetOpacity ||
          direction === 1 && this.get('opacity') >= targetOpacity
        ) {
          window.clearInterval(this.animationClock_);
        }
      }, this),
      interval);
  };


  AnimationLayer.prototype.fadeOut = function(duration) {
    this.fadeTo(0, duration);
  };

  AnimationLayer.prototype.fadeIn = function(duration) {
    this.fadeTo(1, duration);
  };

  AnimationLayer.prototype.stop = function() {
    if (this.animationClock_) {
      window.clearInterval(this.animationClock_);
    }

    return this;
  };


  /**
   * Show the layer.
   * @method show
   */
  AnimationLayer.prototype.show = function() {
    this.setOpacity(1.0);
  };


  /**
   * Hide the layer.
   * @method hide
   */
  AnimationLayer.prototype.hide = function() {
    this.setOpacity(0);
  };

  return AnimationLayer;
});
