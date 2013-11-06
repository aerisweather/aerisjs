define([
  'aeris/util',
  'mapbuilder/core/module/module',
  'sinon',
  'vendor/marionette'
], function(_, Module, sinon, Marionette) {

  var MockRegion = function() {
    var region = sinon.createStubInstance(Marionette.Region);

    return region;
  };


  var MockController = function() {
    return {};
  };

  var MockLayout = function() {
    var layout = sinon.createStubInstance(Marionette.Layout);

    return layout;
  };


  describe('A Module', function() {

    describe('constructor', function() {

      it('should set the provided region', function() {
        var region = new MockRegion();

        spyOn(Module.prototype, 'setRegion');

        new Module({
          region: region
        });

        expect(Module.prototype.setRegion).toHaveBeenCalledWith(region);
      });

      it('should not require a layout or a region', function() {
        // Just don't throw an error,  please.
        new Module({});
      });

    });

    describe('start', function() {

      it('should render it\'s moduleController within it\'s region', function() {
        var controller = new MockController();
        var region = new MockRegion();

        var module = new Module({
          moduleController: controller,
          region: region
        });

        spyOn(region, 'show');

        module.start();

        expect(region.show).toHaveBeenCalledWith(controller);
      });

      it('should invoke it\'s own render method', function() {
        var module;
        var opts = { foo: 'bar' };

        // Note: becuase initializers are defined in
        //      the module constructor, module methods
        //      called by `start` must have their prototype-method
        //      spied on.
        spyOn(Module.prototype, 'render');

        module = new Module();

        module.start(opts);

        expect(Module.prototype.render).toHaveBeenCalledWith(opts);
      });

      it('should start any specified child modules', function() {
        var ChildModule = function() {
          var child = sinon.createStubInstance(Module);
          spyOn(child, 'start');
          return child;
        };

        var opts = { foo: 'bar' };

        var children = {
          modA: new ChildModule(),
          modB: new ChildModule()
        };

        var module = new Module({
          modules: children
        });

        module.start(opts);

        expect(children.modA.start).toHaveBeenCalledWith(opts);
        expect(children.modB.start).toHaveBeenCalledWith(opts);
      });

    });

    describe('setRegion', function() {

      it('should set the region where it\'s moduleController is rendered', function() {
        var controller = new MockController();
        var region = new MockRegion();
        var module = new Module({
          moduleController: controller
        });

        spyOn(region, 'show');

        module.setRegion(region);
        module.start();

        expect(region.show).toHaveBeenCalledWith(controller);
      });

      it('should set the region where it\'s moduleController is rendered, using a named region', function() {
        var layout = new MockLayout();
        var controller = new MockController();
        var region = new MockRegion();
        var module = new Module({
          moduleController: controller
        });

        layout.someRegion = region;

        spyOn(region, 'show');

        module.setRegion('someRegion', layout);
        module.start();

        expect(region.show).toHaveBeenCalledWith(controller);
      });

      it('should reject non-region objects', function() {
        var module = new Module();

        expect(function() {
          module.setRegion({ foo: 'bar' });
        }).toThrowType('InvalidArgumentError');
      });

      it('should require a layout, if a named region is provided', function() {
        var module = new Module();

        expect(function() {
          module.setRegion('someRegion');
        }).toThrowType('InvalidArgumentError');
      });

      it('should require an existing named region', function() {
        var module = new Module();
        var layout = new MockLayout();

        layout.invalid_region = { foo: 'bar' };

        expect(function() {
          module.setRegion('missing_region', layout);
        }).toThrowType('InvalidArgumentError');

        expect(function() {
          module.setRegion('invalid_region', layout);
        }).toThrowType('InvalidArgumentError');
      });

    })

  });

});
