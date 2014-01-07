define(['aeris/util'], function(_) {
  var flagSingleton;

  var Flag = function() {
    this.isFlagged_ = false;

    _.bindAll(this, 'set', 'reset', 'check');
  };

  Flag.prototype.set = function() {
    this.isFlagged_ = true;
  };

  Flag.prototype.reset = function() {
    this.isFlagged_ = false;
  };

  Flag.prototype.check = function() {
    return this.isFlagged_;
  };

  Flag.prototype.waitUntilSet = function(opt_duration, opt_message) {
    var duration = opt_duration || 1000;
    var message = opt_message || 'Flag to be set';

    waitsFor(this.check, duration, message);
  };

  flagSingleton = new Flag();

  afterEach(function() {
    flagSingleton.reset();
  });


  return flagSingleton;
});