describe("jasmine.slow below threshold", function() {
  var clock;

  beforeEach(function(){
    spyOn( window.console, 'log');
    clock = sinon.useFakeTimers();
  });

  afterEach( function() {
    clock.reset();
    window.console.log.reset();
    jasmine.slow.disable();
  });

  describe("#enable", function() {
    describe("when specs take longer than the threshold", function() {
      describe("when passed a threshold", function() {
        beforeEach(function() {
          jasmine.slow.enable(25);
        });

        it("should not log this spec", function() {
          clock.tick(24);
          var afterFunctions = jasmine.getEnv().currentRunner_.after_;
          afterFunctions[ afterFunctions.length - 1 ]();
          expect(window.console.log.callCount).toEqual(0);
        });
      });

      describe("when not passed a threshold", function() {
        beforeEach(function() {
          jasmine.slow.enable();
        });

        it("should not log specs that are faster than the default 75ms", function() {
          clock.tick(74);
          var afterFunctions = jasmine.getEnv().currentRunner_.after_;
          afterFunctions[ afterFunctions.length - 1 ]();
          expect(window.console.log.callCount).toEqual(0);
        });
      });
    });
  });
});
