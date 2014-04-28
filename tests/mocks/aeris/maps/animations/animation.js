define([
  'aeris/util',
  'mocks/mockfactory'
], function(_, MockFactory) {
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
      'isAnimating'
    ]
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

  return MockAnimation;
});
