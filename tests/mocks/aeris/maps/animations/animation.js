define([
  'aeris/util',
  'mocks/mockfactory',
  'aeris/model'
], function(_, MockFactory, Model) {
  /**
   * @class MockAnimation
   * @implements aeris.maps.animations.AnimationInterface
   */
  var MockAnimation = MockFactory({
    name: 'MockAnimation',
    getSetters: [
      'from',
      'to'
    ],
    methods: [
      'start',
      'pause',
      'stop',
      'previous',
      'next',
      'goToTime',
      'getCurrentTime',
      'isAnimating',
      'getLoadProgress',
      'getTimes',
      'setSpeed',
      'setTimestep'
    ],
    inherits: Model,
    constructor: function() {
      this.time_ = new Date().getTime();
    }
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
   * @method goToTime
   * @param {Date|number} time
   */
  MockAnimation.prototype.goToTime = function(time) {
    if (time === this.time_) {
      return;
    }

    this.time_ = time;

    this.trigger('change:time', new Date(this.time_));
  };


  /**
   * @method getCurrentTime
   * @return {Date}
   */
  MockAnimation.prototype.getCurrentTime = function() {
    return new Date(this.time_);
  };

  /**
   * @method getLoadProgress
   * @return {number}
   */
  MockAnimation.prototype.getLoadProgress = function() {
    return 0;
  };


  /**
   * @method getTimes
   * @return {Array.<number>}
   */
  MockAnimation.prototype.getTimes = function() {
    return [];
  };

  /**
   * @method setFrom
   */
  MockAnimation.prototype.setFrom = function(from) {
    if (_.isNumber(from)) {
      from = new Date(from);
    }

    this.set('from', from);
  };

  /**
   * @method setTo
   */
  MockAnimation.prototype.setTo = function(to) {
    if (_.isNumber(to)) {
      to = new Date(to);
    }

    this.set('to', to);
  };


  return MockAnimation;
});
