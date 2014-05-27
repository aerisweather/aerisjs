define([
  'tests/lib/flag'
], function(Flag) {

  describe('A Flag', function() {
    var flagA = new Flag(), flagB = new Flag();

    describe('should reset all instances after each test', function() {

      beforeEach(function() {
      });


      it('when flags are set in a spec', function() {
        expect(flagA.check()).toEqual(false);
        expect(flagB.check()).toEqual(false);
        flagA.set();
        flagB.set();
      });

      it('when running multiple tests with the same flag instances', function() {
        expect(flagA.check()).toEqual(false);
        expect(flagB.check()).toEqual(false);
        flagA.set();
        flagB.set();
      });

    });



  });
});
