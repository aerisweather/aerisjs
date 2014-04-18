define([
  'aeris/util',
  'aeris/application/controllers/itemcontroller',
  'aeris/builder/maps/fullscreen/helpers/fullscreenservice'
], function(_, ItemController, FullscreenService) {
  /**
   * Controls a view which can be restyled into and
   * out of fullscreen mode.
   *
   * @class FullscreenController
   * @namespace aeris.builder.maps.fullscreen.controllers
   * @extends aeris.application.controllers.ItemController
   *
   * @constructor
   * @override
   *
   * @param {Object=} opt_options
   * @param {aeris.builder.maps.fullscreen.helpers.FullscreenService=} opt_options.fullscreenService
   */
  var FullscreenController = function(opt_options) {
    var options = opt_options || {};

    /**
     * The styles of this.$el before
     * entering fullscreen mode.
     *
     * @property stylesOrig_
     * @private
     * @type {?string} Style property (eg. 'margin-left: 12px; color: red')
    */
    this.styleAttrOrig_ = null;


    /**
     * @property fullscreenService_
     * @private
     * @type {aeris.builder.maps.fullscreen.helpers.FullscreenService}
    */
    this.fullscreenService_ = options.fullscreenService || new FullscreenService();


    ItemController.call(this, options);
  };
  _.inherits(FullscreenController, ItemController);


  /**
   * @method enterFullscreen
  */
  FullscreenController.prototype.enterFullscreen = function(opt_styles) {
    if (this.fullscreenService_.isSupported()) {
      this.fullscreenService_.requestFullscreen(this.el);
    }
    else {
      this.setFullscreenElementStyles_(opt_styles);
    }
  };


  /**
   * @method exitFullscreen
  */
  FullscreenController.prototype.exitFullscreen = function() {
    if (this.fullscreenService_.isSupported()) {
      this.fullscreenService_.exitFullscreen();
    }
    else {
      this.resetFullscreenElementStyles_();
    }
  };

  /**
   * @method setFullscreenElementStyles_
   * @private
   * @param {Object} opt_styles Hash of css styles.
   */
  FullscreenController.prototype.setFullscreenElementStyles_ = function(opt_styles) {
    var styles = opt_styles || _.clone(FullscreenController.DEFAULT_FULLSCREEN_STYLES);

    // Save original style attribute, in order to exit fullscreen.
    this.styleAttrOrig_ = this.$el.attr('style') || '';

    this.$el.attr('style', '');
    this.$el.css(styles);
  };

  /**
   * Reset styles on the view to their state
   * when enterFullscreen was last called.
   *
   * @method resetFullscreenElementStyles_
   * @private
  */
  FullscreenController.prototype.resetFullscreenElementStyles_ = function() {
    if (!_.isNull(this.styleAttrOrig_)) {
      this.$el.attr('style', this.styleAttrOrig_);
    }
  };


  /**
   * Default fullscreen styles.
   *
   * @type {Object}
   * @static
   */
  FullscreenController.DEFAULT_FULLSCREEN_STYLES = {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 0,
    margin: 0
  };


  return FullscreenController;
});
