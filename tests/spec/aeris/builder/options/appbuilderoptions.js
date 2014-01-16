define([
  'ai/util',
  'ai/builder/options/appbuilderoptions',
  'ai/config'
], function(_, AppBuilderOptions, aerisConfig) {

  describe('A AppBuilderOptions', function() {
    var STUB_API_ID = 'STUB_API_ID';
    var STUB_API_SECRET = 'STUB_API_SECRET';

    describe('validate', function() {

      describe('should require apiKeys are set, either by...', function() {
        var options;

        beforeEach(function() {
          options = new AppBuilderOptions();

          aerisConfig.unset('apiId');
          aerisConfig.unset('apiSecret');
        });


        it('existing aerisConfig attrs', function() {
          expect(function() {
            options.isValid();
          }).toThrowType('BuilderConfigError');

          aerisConfig.set({
            apiId: STUB_API_ID,
            apiSecret: STUB_API_SECRET
          });
          options.isValid();
        });

        it('attributes set on options', function() {
          expect(function() {
            options.isValid();
          }).toThrowType('BuilderConfigError');

          options.set({
            apiId: STUB_API_ID,
            apiSecret: STUB_API_SECRET
          });
          options.isValid();
        });

      });

    });

  });

});
