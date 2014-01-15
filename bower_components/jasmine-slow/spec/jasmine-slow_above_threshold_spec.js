describe("jasmine.slow above threshold", function() {
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

        it("should log this spec", function() {
          clock.tick(26);
          var afterFunctions = jasmine.getEnv().currentRunner_.after_;
          afterFunctions[ afterFunctions.length - 1 ]();
          expect(window.console.log.callCount).toEqual(1);
        });
      });

      describe("when not passed a threshold", function() {
        beforeEach(function() {
          jasmine.slow.enable();
        });

        it("should log specs that take longer than the default 75ms", function() {
          clock.tick(76);
          var afterFunctions = jasmine.getEnv().currentRunner_.after_;
          afterFunctions[ afterFunctions.length - 1 ]();
          expect(window.console.log.callCount).toEqual(1);
        });
      });
    });
  });
});
