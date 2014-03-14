define(['jasmine'], function(jasmine) {
  var PhantomJSReporter = function() {
    this.failedSpecs_ = [];
    this.startTime_;
  };

  PhantomJSReporter.prototype.reportRunnerStarting = function(runner) {
    this.sendMessage_('jasmine.start', runner.specs().length);
    this.startTime_ = new Date();
  };


  PhantomJSReporter.prototype.reportRunnerResults = function(runner) {
    var result = runner.results();
    var failCount = result.totalCount - result.passedCount;
    var isPassing = !failCount;

    var failedSpecDescriptions = this.failedSpecs_.map(function(spec) {
      return {
        fullName: spec.getFullName(),
        items: spec.results().getItems().filter(function(item) {
          return !item.passed();
        }).map(function(item) {
          return {
            trace: item.trace.stack,
            message: item.message
          };
        })
      };
    }, this);

    this.sendMessage_('jasmine.runnerResult', {
      passedCount: result.passedCount,
      totalCount: result.totalCount,
      failedSpecs: failedSpecDescriptions,
      time: new Date().getTime() - this.startTime_.getTime()
    });
    this.sendMessage_('jasmine.done', isPassing);
  };


  PhantomJSReporter.prototype.reportSpecResults = function(spec) {
    var result = spec.results();

    if (!result.passed()) {
      this.failedSpecs_.push(spec);
    }

    this.sendMessage_('jasmine.specResult', spec.description, result.passed());
  };


  PhantomJSReporter.prototype.sendMessage_ = function(topic, message) {
    var args = [].slice.call(arguments);
    alert(JSON.stringify(args));
  };

  jasmine.PhantomJSReporter = PhantomJSReporter;

  return PhantomJSReporter;
});
