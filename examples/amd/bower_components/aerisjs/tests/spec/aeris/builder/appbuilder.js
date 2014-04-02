define([
  'aeris/util',
  'aeris/builder/appbuilder',
  'aeris/model'
], function(_, AppBuilder, Model) {

  var MockBuilderOptions = function() {
    Model.apply(this, arguments);
  };
  _.inherits(MockBuilderOptions, Model);


  describe('An AppBuilder', function() {

    describe('constructor', function() {

      it('should require a configuration object', function() {
        expect(function() {
          new AppBuilder(null, new MockBuilderOptions());
        }).toThrowType('BuilderConfigError');

        new AppBuilder({}, new MockBuilderOptions());
      });

      it('should require a builderOptions object', function() {
        expect(function() {
          new AppBuilder({}, null);
        }).toThrowType('BuilderConfigError');
      });

    });

  });

});
