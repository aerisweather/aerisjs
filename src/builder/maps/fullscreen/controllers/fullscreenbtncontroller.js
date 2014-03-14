define([
  'aeris/util',
  'aeris/application/controllers/itemcontroller'
], function(_, ItemController) {
  /**
   * Controls the fullscreen button view.
   *
   * @class FullscreenBtnController
   * @namespace aeris.builder.maps.fullscreen.controllers
   * @extends aeris.application.controllers.ItemController
   *
   * @constructor
   * @override
   *
   * @param {Object} options
   * @param {aeris.Events} options.eventHub
   * @param {Object} options.fullscreenStyle
   * @param {string=} options.fullscreenClass CSS class of button to enter fullscreen mode.
   * @param {string=} options.exitFullscreenClass CSS class of button to exit fullscreen mode.
   *
   *
   * @param {Object} options.ui
   * @param {string} options.ui.fullscreenBtn Button which triggers fullscreen behavior.
   */
  var FullscreenBtnController = function(options) {
    /**
     * @property eventHub_
     * @type {aeris.Events}
     * @private
     */
    this.eventHub_ = options.eventHub;

    /**
     * Styles to apply to the application container
     * in full screen mode. Style object must contain
     * valid css keys and values.
     *
     * eg:
     *    {
     *      width: '99%',
     *      height: '800px'
     *      'margin-left': '8.5em'
     *    }
     *
     * @property fullscreenStyle
     * @type {Object}
     * @private
     */
    this.fullscreenStyle_ = options.fullscreenStyle;

    /**
     * @property fullscreenClass_
     * @private
     * @type {string}
    */
    this.fullscreenClass_ = options.fullscreenClass || 'aeris-fullscreen';

    /**
     * @property exitFullscreenClass_
     * @private
     * @type {string}
    */
    this.exitFullscreenClass_ = options.exitFullscreenClass || 'aeris-exit-fullscreen';


    /**
     * @property fullscreenService_
     * @private
     * @type {aeris.builder.maps.fullscreen.helpers.FullscreenService}
    */
    this.fullscreenService_ = options.fullscreenService;


    /**
     * Is fullscreen mode currently active.
     *
     * @property isFullscreen_
     * @private
     * @type {Boolean}
    */
    this.isFullscreen_ = false;

    options.events = {
      'click': function() {
        this.toggleFullscreenMode_();
        return false;
      }
    };

    ItemController.call(this, options);

    this.listenTo(this, {
      'change:fullscreen render': this.updateFullscreenClass_,
      'change:fullscreen': this.triggerFullscreenRequest_
    });

    // Update the button view when fullscreen mode is
    // changed outside of this controller (eg. user hits `esc`
    // to exit fullscreen)
    this.listenTo(this.fullscreenService_, {
      'fullscreen:change': function(isFullscreen) {
        this.isFullscreen_ = isFullscreen;
        this.updateFullscreenClass_();
      }
    });

    /**
     * When fullscreen mode changes.
     *
     * @event change:fullscreen
     * @param {Boolean} isFullscreen
     */
  };
  _.inherits(FullscreenBtnController, ItemController);


  /**
   * @method triggerFullscreenRequest_
   * @private
   */
  FullscreenBtnController.prototype.triggerFullscreenRequest_ = function() {
    var eventTopic = this.isFullscreen_ ? 'fullscreen:request' : 'exitFullscreen:request';

    this.eventHub_.trigger(eventTopic, this.fullscreenStyle_);
  };


  /**
   * @method toggleFullscreenMode_
   * @private
   */
  FullscreenBtnController.prototype.toggleFullscreenMode_ = function() {
    this.isFullscreen_ = !this.isFullscreen_;
    this.trigger('change:fullscreen', this.isFullscreen_);
  };


  /**
   * Update the CSS class of the fullscreen button
   * to reflect the current fullscreen mode.
   *
   * @method updateFullscreenClass_
   * @private
   */
  FullscreenBtnController.prototype.updateFullscreenClass_ = function() {
    if (this.isFullscreen_) {
      this.setExitFullscreenClass_();
    }
    else {
      this.setFullscreenClass_();
    }
  };


  /**
   * @method setFullscreenClass_
   * @private
   */
  FullscreenBtnController.prototype.setFullscreenClass_ = function() {
    this.$el.addClass(this.fullscreenClass_);
    this.$el.removeClass(this.exitFullscreenClass_);
  };


  /**
   * @method setExitFullscreenClass_
   * @private
   */
  FullscreenBtnController.prototype.setExitFullscreenClass_ = function() {
    this.$el.addClass(this.exitFullscreenClass_);
    this.$el.removeClass(this.fullscreenClass_);
  };


  return FullscreenBtnController;
});

/**
 * Requests that fullscreen styles
 * be applied to the application
 * container view.
 *
 * @event fullscreen:request
 * @for aeris.builder.maps.event.EventHub
 * @param {Object} fullscreenStyle
 */

/**
 * Requests that fullscreen styles
 * be removed from the application
 * container view.
 *
 * @event exitFullscreen:request
 * @for aeris.builder.maps.event.EventHub
 * @param {Object} fullscreenStyle Original fullscreen styles.
 */
