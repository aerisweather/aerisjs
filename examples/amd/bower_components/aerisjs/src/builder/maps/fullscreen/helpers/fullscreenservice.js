define([
  'aeris/util',
  'aeris/events',
  'aeris/builder/maps/fullscreen/errors/fullscreennotsupportederror'
], function(_, Events, FullscreenNotSupportedError) {
  var root = this;

  /**
   * A wrapper around native implementations of the
   * fullscreen API. Provides support for varying implementations
   * and api prefixes.
   *
   * @class FullscreenService
   * @namespace aeris.builder.maps.fullscreen.helpers
   * @constructor
   *
   * @uses {aeris.Events}
   *
   * @param {Object=} opt_options
   * @param {HTMLElement=} opt_options.document Client document.
   */
  var FullscreenService = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      document: root.document
    });

    /**
     * @property document_
     * @private
     * @type {HTMLElement}
    */
    this.document_ = options.document;


    Events.call(this);


    this.proxyDocumentFullscreenEvents_();

    /**
     * @event fullscreen:change
     * @param {Boolean} isFullscreen
     */
    /**
     * @event fullscreen:enter
     */
    /**
     * @event fullscreen:exit
     */
  };
  _.extend(FullscreenService.prototype, Events.prototype);


  /**
   * @method proxyDocumentFullscreenEvents_
   * @private
   */
  FullscreenService.prototype.proxyDocumentFullscreenEvents_ = function() {
    var fullscreenEvents = [
      'fullscreenchange',
      'mozfullscreenchange',
      'webkitfullscreenchange',
      'msfullscreenchange'
    ];

    // Debounce change listener, so it is only called once
    // in the case of several vendor-prefixed events being fired.
    var changeListener = _.debounce(_.bind(this.triggerFullscreenEvents_, this), 0, true);

    _.each(fullscreenEvents, function(event) {
      this.document_.addEventListener(event, changeListener);
    }, this);
  };


  /**
   * @method triggerFullscreenEvents_
   * @private
   */
  FullscreenService.prototype.triggerFullscreenEvents_ = function() {
    var isFullscreen = this.isFullscreen_();
    var fullscreenEvent = isFullscreen ? 'fullscreen:enter' : 'fullscreen:exit';

    this.trigger('fullscreen:change', isFullscreen);
    this.trigger(fullscreenEvent);
  };


  /**
   * @method isFullscreen_
   * @private
   * @return {Boolean}
   */
  FullscreenService.prototype.isFullscreen_ = function() {
    var vendorIsFullScreenProps = [
      'fullscreen',
      'mozFullScreen',
      'webkitIsFullScreen',
      'msFullscreenElement'
    ];
    var isFullscreen = false;

    _.each(vendorIsFullScreenProps, function(prop) {
      if (!!this.document_[prop]) {
        isFullscreen = true;
      }
    }, this);

    return isFullscreen;
  };


  /**
   * Sets an element to fullscreen mode
   *
   * @method requestFullscreen
   * @param {HTMLElement} element
   *
   * @throws {aeris.builder.maps.fullscreen.error.FullscreenNotSupportedError}
   *          If the client's browser does not programmatically entering
   *          fullscreen mode.
   */
  FullscreenService.prototype.requestFullscreen = function(element) {
    var fullscreenApi = element.requestFullscreen ||
      element.msRequestFullscreen ||
      element.mozRequestFullScreen ||
      element.webkitRequestFullscreen;

    if (!fullscreenApi) {
      this.throwUnsupportedApiError_();
    }

    fullscreenApi.call(element);
  };


  /**
   * Exit fullscreen mode
   *
   * @method exitFullscreen
   *
   * @throws {aeris.builder.maps.fullscreen.error.FullscreenNotSupportedError}
   *          If the client's browser does not support programmatically
   *          exiting fullscreen mode.
   */
  FullscreenService.prototype.exitFullscreen = function() {
    var exitFullscreenApi = this.document_.exitFullscreen ||
      this.document_.mozCancelFullScreen ||
      this.document_.webkitExitFullscreen ||
      this.document_.msExitFullscreen;

    if (!exitFullscreenApi) {
      this.throwUnsupportedApiError_();
    }

    exitFullscreenApi.call(this.document_);
  };


  /**
   * @method throwUnsupportedApiError_
   * @private
   * @throws {aeris.builder.maps.fullscreen.error.FullscreenNotSupportedError}
   */
  FullscreenService.prototype.throwUnsupportedApiError_ = function() {
    throw new FullscreenNotSupportedError('Unable to change fullscreen mode: ' +
      'the fullscreenAPI is not supported by the this browser.');
  };


  /**
   * Is the fullscreen API supported
   * by the client's browser.
   *
   * @method isSupported
   * @param {HTMLElement} opt_element= Element to use for feature detection. Defaults to document.body.
   * @return {Boolean}
   */
  FullscreenService.prototype.isSupported = function(opt_element) {
    var element = opt_element || this.document_.body;
    var fullscreenApi = element.requestFullscreen ||
      element.msRequestFullscreen ||
      element.mozRequestFullScreen ||
      element.webkitRequestFullscreen;

    return !!fullscreenApi;
  };


  return FullscreenService;
});
