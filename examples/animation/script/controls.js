define([
  'vendor/jquery',
  'text!examples/animation/view/controls.html'
], function($, template) {
  return function(div, anim) {
    div.html(template);


    $('body').on('keydown', function(evt) {
      if (evt.which === 37) {
        anim.pause();
        anim.previous();
      }
      else if (evt.which === 39) {
        anim.pause();
        anim.next();
      }
      else if (evt.which === 13 || evt.which === 32) {
        if (anim.isAnimating()) {
          anim.pause();
        }
        else {
          anim.start();
        }
      }
    });


    $('#start').click(function() {
      anim.start();
    });
    $('#stop').click(function() {
      anim.stop();
    });
    $('#pause').click(function() {
      anim.pause();
    });
    $('#prev').click(function() {
      anim.pause();
      anim.previous();
    });
    $('#next').click(function() {
      anim.pause();
      anim.next();
    });

    $('#speedSelect').on('change', function() {
      anim.setSpeed(parseInt($(this).val()));
      $('#speedText').text($(this).val() + ' animated minutes per second');
    });
    $('#speedSelect').val(120).trigger('change');

    $('#opacitySelect').on('change', function() {
      anim.setOpacity(parseInt($(this).val()) / 100);
    });

    // Time select
    anim.on('load:times', function() {
      $('#timeSelect').
        attr('min', anim.getTimes()[0]).
        attr('max', anim.getTimes()[anim.getTimes().length - 1]).
        change(function() {
          anim.pause();
          anim.goToTime(parseInt($(this).val()));
        });
    });

    anim.on('change:time', function(time) {
      $('#timeSelect').val(time.getTime());
      $('#time').text(time.toLocaleString());
    });
    $('#time').text((new Date()).toLocaleString());

    anim.on('load:progress', function(progress) {
      if (progress < 1) {
        $('#progressText').text('Loading...');
      }
      else {
        $('#progressText').text('Done.');
      }

      $('#progress').val(progress);
    });
  };
});
