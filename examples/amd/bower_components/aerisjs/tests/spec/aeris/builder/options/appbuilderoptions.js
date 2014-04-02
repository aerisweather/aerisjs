define([
  'aeris/util',
  'aeris/builder/options/appbuilderoptions',
  'mocks/aeris/config'
], function(_, AppBuilderOptions, MockConfig) {

  describe('A AppBuilderOptions', function() {
    
    afterEach(function() {
      MockConfig.restore();
    });
    

    describe('validate', function() {

      describe('should require apiKeys are set, either by...', function() {
        var options;

        beforeEach(function() {
          options = new AppBuilderOptions();
        });


        it('existing aerisConfig attrs', function() {
          expect(function() {
            options.isValid();
          }).toThrowType('BuilderConfigError');

          MockConfig.stubApiKeys();
          options.isValid();
        });

        it('attributes set on options', function() {
          var apiIdStub = _.uniqueId('apiIdStub_');
          var apiSecretStub = _.uniqueId('apiSecretStub_');
          expect(function() {
            options.isValid();
          }).toThrowType('BuilderConfigError');

          options.set({
            apiId: apiIdStub,
            apiSecret: apiSecretStub
          });
          options.isValid();
        });

      });

    });

  });

});
