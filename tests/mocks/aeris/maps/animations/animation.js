define([
  'aeris/util',
  'mocks/mockfactory',
  'aeris/events'
], function(_, MockFactory, Events) {
  /**
   * @class MockAnimation
   * @implements aeris.maps.animations.AnimationInterface
   */
  var MockAnimation = MockFactory({
    name: 'MockAnimation',
    methods: [
      'start',
      'pause',
      'stop',
      'previous',
      'next',
      'goToTime',
      'getCurrentTime',
      'isAnimating'
    ],
    inherits: Events
  });

  /**
   * @method start
   */
  MockAnimation.prototype.start = function() {
    this.isPlaying_ = true;
  };


  /**
   * @method stop
   */
  MockAnimation.prototype.stop = function() {
    this.isPlaying_ = false;
  };


  /**
   * @method pause
   */
  MockAnimation.prototype.pause = function() {
    this.isPlaying_ = false;
  };


  /**
   * @method isAnimating
   */
  MockAnimation.prototype.isAnimating = function() {
    return !!this.isPlaying_;
  };


  /**
   * @method getCurrentTime
   * @return {Date}
   */
  MockAnimation.prototype.getCurrentTime = function() {
    return new Date();
  };


  return MockAnimation;
});
