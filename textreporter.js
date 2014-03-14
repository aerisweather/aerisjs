function TextReporter() {
  this.textResult = "";
}

TextReporter.prototype = new jasmine.Reporter();

TextReporter.prototype.onRunnerFinished = function (callback) {
  this.callbackEnd = callback;
};

TextReporter.prototype.reportRunnerResults = function (runner) {
  // When all the spec are finished //
  var result = runner.results();

  this.textResult += "Test results :: (" + result.passedCount + "/" + result.totalCount + ") :: " + (result.passed() ? "passed" : "failed");
  this.textResult += "\r\n";

  if (this.callbackEnd) {
    this.callbackEnd(this.textResult);
  }
};

TextReporter.prototype.reportSuiteResults = function (suite) {
  // When a group of spec has finished running //
  var result = suite.results();
  var description = suite.description;
}

TextReporter.prototype.reportSpecResults = function(spec) {
  // When a single spec has finished running //
  var result = spec.results();

  this.textResult += "Spec :: " + spec.description + " :: " + (result.passed() ? "passed" : "failed");
  this.textResult += "\r\n";
};