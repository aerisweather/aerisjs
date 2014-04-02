define([
  'aeris/util',
  'aeris/builder/maps/infopanel/helpers/infopanelrenderer',
  'aeris/events',
  'mocks/marionette/region',
  'mocks/aeris/application/controllers/controllerinterface'
], function(_, InfoPanelRenderer, Events, MockRegion, MockController) {


  describe('An InfoPanelRenderer', function() {
    var infoPanelRenderer, eventHub, mockRegion, mockController;

    beforeEach(function() {
      eventHub = new Events();
      mockRegion = new MockRegion();

      mockController = new MockController

      infoPanelRenderer = new InfoPanelRenderer({
        eventHub: eventHub,
        region: mockRegion
      });
    });

    describe('EventHub events', function() {

      beforeEach(function() {
        infoPanelRenderer.activate();
      });



      describe('info:show', function() {
        var onInfoShow;

        beforeEach(function() {
          onInfoShow = jasmine.createSpy('onInfoShow');
          eventHub.on('info:show', onInfoShow);
        });


        it('should emit when the renderer shows a view', function() {
          infoPanelRenderer.show(mockController);

          expect(onInfoShow).toHaveBeenCalled();
        });

        it('should provide the shown view\'s controller', function() {
          infoPanelRenderer.show(mockController);

          expect(onInfoShow).toHaveBeenCalledWith(mockController);
        });

        it('should not emit if someone else shows a view', function() {
          mockRegion.trigger('show')

          expect(onInfoShow).not.toHaveBeenCalled();
        });

        it('should not emit if the renderer is deactivated', function() {
          infoPanelRenderer.deactivate();

          infoPanelRenderer.show(mockController);

          expect(onInfoShow).not.toHaveBeenCalled();
        });

        it('should emit if the renderer is reactivated', function() {
          infoPanelRenderer.deactivate();
          infoPanelRenderer.activate();

          infoPanelRenderer.show(mockController);

          expect(onInfoShow).toHaveBeenCalled();
        });

      });

      describe('info:close', function() {
        var onInfoClose;

        beforeEach(function() {
          onInfoClose = jasmine.createSpy('onInfoClose');
          eventHub.on('info:close', onInfoClose);

          infoPanelRenderer.show(mockController);
        });

        it('should emit when a rendered controller closes', function() {
          mockController.close();

          expect(onInfoClose).toHaveBeenCalled();
        });

        it('should not emit if the renderer is deactivated', function() {
          infoPanelRenderer.deactivate();

          mockController.close();

          expect(onInfoClose).not.toHaveBeenCalled();
        });

        it('should emit if the renderer is reactivated', function() {
          infoPanelRenderer.deactivate();
          infoPanelRenderer.activate();

          mockController.close();

          expect(onInfoClose).toHaveBeenCalled();
        });

      });

    });

  });

});
