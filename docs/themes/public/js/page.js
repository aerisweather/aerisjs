/**
 * Various behavior for the page view.
 */
$(document).ready(function() {
  function stickyScroll($sticker, topOffset, bottomOffset) {
    function stickTheSticker() { // scroll event
      var scrollDiffTop = topOffset - $(window).scrollTop();
      var isScrollBeyondTopViewport = scrollDiffTop > topOffset;

      var scrollDiffBottom = $(document).height() - $(window).height() - $(window).scrollTop() - bottomOffset;
      var isScrollBeyondBottomViewport = (scrollDiffBottom * -1) > bottomOffset;

      if (scrollDiffTop >= 0 && !isScrollBeyondTopViewport) {
        $sticker.css('top', scrollDiffTop);
      }
      else if (!isScrollBeyondTopViewport) {
        $sticker.css('top', 0);
      }

      if (scrollDiffBottom < 0) {
        if (!isScrollBeyondBottomViewport) {
          $sticker.css('bottom', scrollDiffBottom * -1);
        }
        else {
          $sticker.css('bottom', bottomOffset);
        }
      }
      else {
        $sticker.css('bottom', 0);
      }
    }

    $(window).scroll(stickTheSticker);

    stickTheSticker();
  }

  stickyScroll($('#sidebar'), $('#super-header').height(), $('footer').outerHeight());

  // Fork Me
  stickyScroll($('.forkMe img'), $('#super-header').height(), $('footer').outerHeight());
  // So we don't need to customize the widget code
  $('.forkMe a').attr('target', '_blank');


  function goToWeather(place) {
    window.location = 'http://wx.hamweather.com/?pands=' + 55417;
  }

  $('#weatherSearch').submit(function (evt) {
    var weatherLocation = $(this).find('input[type=search]').val();

    goToWeather(weatherLocation);

    evt.preventDefault();
    return false;
  });


  // Tooltips
  // http://iamceege.github.io/tooltipster/#options
  $('.ref').tooltipster({
    delay: 100,
    speed: 100,           // animation speed
    position: 'top',
    theme: 'tooltipster-aerisjs',
    interactive: true,
    contentAsHTML: true
  });
});