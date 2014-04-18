define([
  'aeris/util',
  'aeris/builder/maps/fullscreen/modules/fullscreenmodule',
  'jquery',
  'aeris/model',
  'mocks/aeris/application/controllers/controllerinterface',
  'aeris/events'
], function(_, FullscreenModule, $, Model, MockController, Events) {

  describe('A FullscreenModule', function() {
    
    describe('start', function() {
      var fullscreenModule, fullscreenController, fullscreenBtnController, eventHub;
      var startOptions, $appEl;

      beforeEach(function() {
        eventHub = new Events();
        fullscreenController = new MockController();
        fullscreenBtnController = new MockController();

        fullscreenModule = new FullscreenModule({
          fullscreenController: fullscreenController,
          fullscreenBtnController: fullscreenBtnController,
          eventHub: eventHub
        });
      });
      
      beforeEach(function() {
        $appEl = $('<div></div>');
        startOptions = new Model({
          el: $appEl
        });
      });
      

      it('should not render the fullscreenBtnController before initialization', function() {
        expect(fullscreenBtnController.render).not.toHaveBeenCalled();
      });

      it('should not render the fullscreenBtnController on initialization', function() {
        // controller is rendered by mapControls module
        // so we do not need to render it again in fullscreen module
        fullscreenModule.start(startOptions);
        expect(fullscreenBtnController.render).not.toHaveBeenCalled();
      });
      
      it('should set the fullscreenController element from the initialization options', function() {
        expect(fullscreenController.setElement).not.toHaveBeenCalled();

        fullscreenModule.start(startOptions);

        expect(fullscreenController.setElement).toHaveBeenCalledWith($appEl);
      });

      describe('\'mapControls:ready\' event', function() {
        var onMapControlsReady;

        beforeEach(function() {
          onMapControlsReady = jasmine.createSpy('onMapControlsReady');
          eventHub.on('mapControls:ready', onMapControlsReady);
        });


        it('should not fire before initialization', function() {
          expect(onMapControlsReady).not.toHaveBeenCalled();
        });

        it('should fire after initialization', function() {
          fullscreenModule.start(startOptions);

          expect(onMapControlsReady).toHaveBeenCalled();
        });

        it('should pass the fullscreenBtnController and name', function() {
          fullscreenModule.start(startOptions);

          expect(onMapControlsReady).toHaveBeenCalledWith(fullscreenBtnController, 'fullscreen');
        });

      });

    });

  });

});
