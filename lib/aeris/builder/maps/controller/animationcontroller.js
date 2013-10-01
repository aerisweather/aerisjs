define([
  'aeris/util',
  'aeris/controller',
  'base/animations/animationsync',
  'vendor/text!aeris/builder/maps/view/animationcontrols.html'
], function(_, Controller, AnimationSync, template) {
  /**
   * @constructor
   * @class aeris.builder.maps.controller.AnimationController
   * @extends aeris.Controller
   */
  var AnimationController = function(opt_options) {

    this.className = 'aeris-animation-controls';

    this.ui = {
      btn: 'button'
    };

    this.events = {
      'click btn': this.togglePlay
    };

    this.isPlaying = false;

    /**
     * @type {aeris.maps.animations.AnimationSync}
     */
    this.animationSync_ = new AnimationSync(opt_options.layers);

    Controller.call(this, opt_options);
  };
  _.inherits(AnimationController, Controller);


  AnimationController.prototype.render = function() {
    this.undelegateEvents();

    this.$el.html(template);
    this.bindUIElements();
    this.delegateEvents();

    if (this.options.autoStart) {
      this.animationSync_.start();
      this.isPlaying = true;
    }

    return this;
  };


  AnimationController.prototype.togglePlay = function() {
    var animMethod = this.isPlaying ? 'stop' : 'start';
    this.animationSync_[animMethod]();


    this.isPlaying = !this.isPlaying;

    this.ui.btn.text(this.isPlaying ? 'Stop' : 'Play');
  };


  return AnimationController;
});
