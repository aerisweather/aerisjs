define([
  'aeris/util',
  'aeris/builder/options/appbuilderoptions',
  'aeris/config'
], function(_, AppBuilderOptions, aerisConfig) {

  describe('A AppBuilderOptions', function() {
    var STUB_API_ID = 'STUB_API_ID';
    var STUB_API_SECRET = 'STUB_API_SECRET';

    describe('should require apiKeys are set, either by...', function() {

      beforeEach(function() {
        aerisConfig.unset('apiId');
        aerisConfig.unset('apiSecret');
      });


      it('existing aerisConfig attrs', function() {
        expect(function() {
          new AppBuilderOptions();
        }).toThrowType('BuilderConfigError');

        aerisConfig.set({
          apiId: STUB_API_ID,
          apiSecret: STUB_API_SECRET
        });
        new AppBuilderOptions();
      });

      it('attributes passed to constructor', function() {
        expect(function() {
          new AppBuilderOptions();
        }).toThrowType('BuilderConfigError');

        new AppBuilderOptions({
          apiId: STUB_API_ID,
          apiSecret: STUB_API_SECRET
        });
      });

    });

  });

});
