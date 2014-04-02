define(function() {
  /**
   * Trigger a mouse event on an element.
   * Should be used in place of jQuery.trigger,
   * as it works more consistently in PhantomJS
   *
   * See:
   *  http://stackoverflow.com/questions/16802795/click-not-working-in-mocha-phantomjs-on-certain-elements
   *
   * @param {HTMLElement} el
   * @param {string} type Event name.
   */
  return function triggerMouseEvent(el, type) {
    var event = document.createEvent('MouseEvent');
    event.initMouseEvent(
      type,
      true /* bubble */, true /* cancelable */,
      window, null,
      0, 0, 0, 0, /* coordinates */
      false, false, false, false, /* modifier keys */
      0 /*left*/, null
    );
    el.dispatchEvent(event);
  }
});
