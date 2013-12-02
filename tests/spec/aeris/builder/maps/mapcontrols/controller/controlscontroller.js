define([
  'aeris/util',
  'mapbuilder/mapcontrols/controller/controlscontroller',
  'aeris/events',
  'aeris/model'
], function(_, ControlsController, Events, Model) {

  var MockBuilderOptions = function(opt_attrs) {
    var attrs = _.defaults(opt_attrs || {}, {
      controls:{
        layers: true,
        waypoints: true,
        trails: false
      }
    });
    var opts = new Model(attrs);

    return opts;
  };


  var MockController = function() {
    var controller = { id: _.uniqueId('mockController_')};

    controller.$el = { id: _.uniqueId('mockController.$el_')};

    return controller;
  };


  describe('A ControlsController', function() {

    describe('constructor', function() {

      describe('Event bindings', function() {

        it('should add only white-listed controls on mapControls:ready', function() {
          var controller;
          var eventHub = new Events();
          var layerControls = new MockController();
          var waypointControls = new MockController();
          var trailsControls = new MockController();

          spyOn(ControlsController.prototype, 'addControls');

          controller = new ControlsController({
            template: '<div></div>',
            builderOptions: new MockBuilderOptions({
              controls: {
                layers: true,
                waypoints: true,
                trails: false
              }
            }),
            eventHub: eventHub
          });
          controller.render();

          eventHub.trigger('mapControls:ready', layerControls, 'layers');
          expect(ControlsController.prototype.renderControlsView).toHaveBeenCalledWith(layerControls, 'layers');

          eventHub.trigger('mapControls:ready', waypointControls, 'waypoints');
          expect(ControlsController.prototype.renderControlsView).toHaveBeenCalledWith(waypointControls, 'waypoints');

          eventHub.trigger('mapControls:ready', trailsControls, 'trails');
          expect(ControlsController.prototype.renderControlsView).not.toHaveBeenCalledWith(trailsControls, 'trails');

        });

      });

    });

    describe('addControls', function() {

      it('should append the controller element to view', function() {
        var controller = new ControlsController({
          eventHub: new Events(),
          builderOptions: new MockBuilderOptions()
        });
        var controls = new MockController();

        controller.render();

        spyOn(controller.$el, 'append');

        controller.addControls(controls);

        expect(controller.$el.append).toHaveBeenCalledWith(controls.$el);
      });

    });

  });

});
