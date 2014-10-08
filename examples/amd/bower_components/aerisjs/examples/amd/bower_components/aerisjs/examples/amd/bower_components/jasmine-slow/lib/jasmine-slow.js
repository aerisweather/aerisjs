// Created by Jonathan Eatherly, (https://github.com/joneath)
// MIT license
// Version 0.1.1

jasmine.slow = (function() {
  var self = {},
      defaultThreshold = 75,
      before = function(){},
      after = function(){},
      beforeWrap = function(){before();},
      afterWrap = function(){after();};

  self.enable = function(customThreshold) {
    var threshold = customThreshold || defaultThreshold,
        runTime = 0;

    before = function() {
      runTime = now();
    };

    after = function() {
      var timeDiff = now() - runTime,
          currentSpec,
          parentDesc = "",
          suiteDesc,
          specDesc,
          reportStr;

      if (timeDiff >= threshold) {
        currentSpec = jasmine.getEnv().currentSpec;
        specDesc = currentSpec.description;
        suiteDesc = currentSpec.suite.description;

        if (currentSpec.suite.parentSuite) {
          parentDesc = currentSpec.suite.parentSuite.description + " ";
        }
        reportStr = "spec #" + currentSpec.id + " took " + timeDiff + "ms: " + parentDesc + suiteDesc + " it " + specDesc;

        console.log(reportStr);
      }
    };
  };

  self.disable = function() {
    before = function() { };
    after = function() { };
  };

  beforeEach(beforeWrap);
  afterEach(afterWrap);

  return self;

  function now() {
    return (new Date()).getTime();
  }
}( ));
