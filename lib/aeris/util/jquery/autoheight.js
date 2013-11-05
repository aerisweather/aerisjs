define([
  'vendor/jquery'
], function($) {
  /**
   * Returns the height of the elements,
   * as though it were displayed with a height of 'auto'.
   *
   * @returns {number}
   */
  $.prototype.getAutoHeight = function() {
    var $el = this.clone().attr('id', false);
    var height;

    $el.
      css({
        display: 'block',
        visibility: 'hidden',
        height: 'auto'
      }).
      appendTo('body');

    height = $el.height();

    $el.remove();

    return height;
  };

  return $;
});
