define([
  'aeris/util',
  'application/controller/templatehelperregistrar/handlebarstemplatehelperregistrar'
], function(_, HandlebarsTemplateHelperRegistrar) {


  describe('A HandlebarsTemplateHelper', function() {
    var template, helpers;


    beforeEach(function() {
      template = jasmine.createSpy('template');

      helpers = {
        helperA: jasmine.createSpy('helperA'),
        helperB: jasmine.createSpy('helperB')
      };
    });


    describe('constructor', function() {

      it('should not require a template or helpers to be defined', function() {
        // Should not throw error
        new HandlebarsTemplateHelperRegistrar();
      });

      it('should set the template', function() {
        spyOn(HandlebarsTemplateHelperRegistrar.prototype, 'setTemplate');
        new HandlebarsTemplateHelperRegistrar(template);

        expect(HandlebarsTemplateHelperRegistrar.prototype.setTemplate).toHaveBeenCalledWith(template);
      });

      it('should set the helpers', function() {
        spyOn(HandlebarsTemplateHelperRegistrar.prototype, 'setHelpers');
        new HandlebarsTemplateHelperRegistrar(null, helpers);

        expect(HandlebarsTemplateHelperRegistrar.prototype.setHelpers).toHaveBeenCalledWith(helpers);
      });

    });


    describe('setTemplate', function() {

      it('should require a function', function() {
        var registrar = new HandlebarsTemplateHelperRegistrar();

        expect(function() {
          registrar.setTemplate({ foo: 'bar' });
        }).toThrowType('InvalidArgumentError');

        // Should not throw error
        registrar.setTemplate(function() {});
      });

    });


    describe('setHelpers', function() {

      it('should require a hash of functions', function() {
        var registrar = new HandlebarsTemplateHelperRegistrar();

        var shouldRejectHelpers = function(helpers) {
          expect(function() {
            registrar.setHelpers(helpers);
          }).toThrowType('InvalidArgumentError');
        };

        var invalidHelpers = [
          { foo: 'bar' },
          function() {},
          'foo'
        ];

        _.each(invalidHelpers, shouldRejectHelpers);

        // Should not throw error
        registrar.setHelpers({
          foo: function() {}
        });
      });

    });


    describe('getTemplateWithHelpers', function() {

      it('should require helpers and template to be defined', function() {
        var registrar = new HandlebarsTemplateHelperRegistrar();

        expect(function() {
          registrar.getTemplateWithHelpers();
        }).toThrowType('InvalidArgumentError');

        // Should not throw error
        registrar.setTemplate(template);
        registrar.setHelpers(helpers);
        registrar.getTemplateWithHelpers();
      });


      describe('the returned template() method', function() {

        it('should be called with template data, and the helper methods', function() {
          var helperRegistrar = new HandlebarsTemplateHelperRegistrar(template, helpers);
          var boundTemplate;

          boundTemplate = helperRegistrar.getTemplateWithHelpers();

          template.andCallFake(function(data, options) {
            expect(data).toEqual({ foo: 'bar' });
            expect(options.helpers.helperA).toEqual(helpers.helperA);
            expect(options.helpers.helperB).toEqual(helpers.helperB);
          });
          boundTemplate({ foo: 'bar' });

          expect(template).toHaveBeenCalled();
        });

      });

    });


    describe('getTemplateWithHelpersBoundTo', function() {

      it('should bind the helpers to a context', function() {
        var testCtx = { foo: 'bar' };
        var isHelperACalled, isHelperBCalled;
        var registrar = new HandlebarsTemplateHelperRegistrar(template);

        helpers = {
          helperA: function() {
            expect(this).toEqual(testCtx);
            isHelperACalled = true;
          },
          helperB: function() {
            expect(this).toEqual(testCtx);
            isHelperBCalled = true;
          }
        };
        registrar.setHelpers(helpers);

        registrar.getTemplateWithHelpersBoundTo(testCtx);

        helpers.helperA();
        expect(isHelperACalled).toBeTruthy();

        helpers.helperB();
        expect(isHelperBCalled).toBeTruthy();
      });

    })

  });

});