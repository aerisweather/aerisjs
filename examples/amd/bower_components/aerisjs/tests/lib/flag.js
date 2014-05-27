define(['aeris/util'], function(_) {
  var flagInstances = [];

  /**
   * A simple 'on'/'off' flag.
   *
   * Useful for checking state in async tests.
   *
   * Eg.
   *
   *    var flag;
   *
   *    beforeEach(function() {
   *      flag = new Flag();
   *    });
   *    afterEach(function() {
   *      flag.reset();
   *    });
   *
   *    it('should fire event', function() {
   *      obj.on('event', flag.set);
   *      doSomething();
   *
   *      waits(flag.check, 500, 'event to fire');
   *    });
   *
   *
   * @class Flag
   * @constructor
   */
  var Flag = function() {
    flagInstances.push(this);
    this.isFlagged_ = false;

    _.bindAll(this, 'set', 'reset', 'check');
  };


  /**
   * @method set
   * @this {Flag}
   */
  Flag.prototype.set = function() {
    this.isFlagged_ = true;
  };


  /**
   * @method reset
   * @this {Flag}
   */
  Flag.prototype.reset = function() {
    this.isFlagged_ = false;
  };

  /**
   * Is flag set?
   *
   * @method check
   * @this {Flag}
   * @return {Boolean}
   */
  Flag.prototype.check = function() {
    return this.isFlagged_;
  };


  /**
   * Run a jasmine.waitsFor method, checking for the flag to be set.
   *
   * @param {number=} opt_waitDuration
   * @param {string=} opt_message
   */
  Flag.prototype.waitUntilSet = function(opt_waitDuration, opt_message) {
    var waitDuration = opt_waitDuration || 1000;
    var message = opt_message || 'Flag to be set';

    waitsFor(this.check, waitDuration, message);
  };


  /**
   * Waits for flag to be set,
   * then runs the callback.
   *
   * (for use in jasmine test specs, only)
   *
   * @method then
   * @param {Function} cb
   * @param {number=} opt_timeout
   * @param {string=} opt_timeoutMsg
   */
  Flag.prototype.then = function(cb, opt_timeout, opt_timeoutMsg) {
    this.waitUntilSet(opt_timeout, opt_timeoutMsg);
    runs(cb);
  };

  afterEach(function() {
    _.invoke(flagInstances, 'reset');
  });



  return Flag;
});
