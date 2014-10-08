define([
  'jasmine'
], function(jasmine) {
  jasmine.Env.prototype.describe = function(description, specDefinitions) {
    var suite = new jasmine.Suite(this, description, specDefinitions, this.currentSuite);

    var parentSuite = this.currentSuite;
    if (parentSuite) {
      parentSuite.add(suite);
    } else {
      this.currentRunner_.add(suite);
    }

    this.currentSuite = suite;

    var declarationError = null;
    try {
      specDefinitions.call(suite);
    } catch (e) {
      declarationError = e;
    }

    if (declarationError) {
      // MODIFIED
      // See issue https://github.com/pivotal/jasmine/pull/96
      // ----------
      //this.it("encountered a declaration exception", function() {
      window.setTimeout(function() {
        throw declarationError;
      }, 0);
      //});
    }

    this.currentSuite = parentSuite;

    return suite;
  };

  return jasmine;
});
