define([
  'aeris/util',
  'aeris/builder/maps/core/helpers/renderer',
  'mocks/aeris/application/controllers/controllerinterface'
], function(_, Renderer, MockController) {

  var MockRegion = function() {
    var stubbedMethods = [
      'show',
      'close'
    ];

    _.extend(this, jasmine.createSpyObj('region', stubbedMethods));
  };



  describe('A Renderer', function() {
    var renderer, region, controller;

    beforeEach(function() {
      controller = new MockController();
      region = new MockRegion();
      renderer = new Renderer({
        region: region
      });
    });


    describe('show', function() {

      it('should not show a view before being activated', function() {
        renderer.show(controller);

        expect(region.show).not.toHaveBeenCalled();
      });

      it('should show a view after being activated', function() {
        renderer.activate();
        renderer.show(controller);

        expect(region.show).toHaveBeenCalledWith(controller);
      });

      it('should not show a view after being deactivated', function() {
        renderer.activate();

        renderer.deactivate();
        renderer.show(controller);

        expect(region.show).not.toHaveBeenCalled();
      });

    });

    describe('close', function() {

      it('should not close a view before being activated', function() {
        renderer.close();

        expect(region.close).not.toHaveBeenCalled();
      });

      it('should close a view after being activated', function() {
        renderer.activate();
        renderer.close();

        expect(region.close).toHaveBeenCalled();
      });

      it('should not close a view after being deactivated', function() {
        renderer.activate();

        renderer.deactivate();
        renderer.close();

        expect(region.close).not.toHaveBeenCalled();
      });

    });

  });

});
