define([
  'aeris/util',
  'aeris/builder/maps/mapcontrols/controllers/mapcontrolscontroller',
  'aeris/events',
  'aeris/model',
  'aeris/application/controllers/layoutcontroller',
  'jquery',
  'marionette'
], function(_, MapControlsController, Events, Model, LayoutController, $, Marionette) {

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


  var MockRegion = function() {
    spyOn(this, 'show');
    spyOn(this, 'close');

    this.$el = $('<div></div>');
  };
  _.inherits(MockRegion, Marionette.Region);


  describe('A ControlsController', function() {
    var templateFn;

    beforeEach(function() {
      templateFn = function() { return 'foo'; };
    });



    describe('render', function() {

      describe('Event bindings', function() {

        it('should add only white-listed controls on mapControls:ready', function() {
          var controller;
          var eventHub = new Events();
          var layerControls = new MockController();
          var waypointControls = new MockController();
          var trailsControls = new MockController();

          spyOn(MapControlsController.prototype, 'renderControlsView');

          controller = new MapControlsController({
            template: templateFn,
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
          expect(MapControlsController.prototype.renderControlsView).toHaveBeenCalledWith(layerControls, 'layers');

          eventHub.trigger('mapControls:ready', waypointControls, 'waypoints');
          expect(MapControlsController.prototype.renderControlsView).toHaveBeenCalledWith(waypointControls, 'waypoints');

          eventHub.trigger('mapControls:ready', trailsControls, 'trails');
          expect(MapControlsController.prototype.renderControlsView).not.toHaveBeenCalledWith(trailsControls, 'trails');

        });

      });

    });

    describe('renderControlsView', function() {

      it('should render the controls view in a region', function() {
        var mapOptionControls, geosearchControls;
        var controlsController = new MapControlsController({
          eventHub: new Events(),
          builderOptions: new MockBuilderOptions(),
          regions: {
            mapOptionControlsRegion: '.someSelector',
            geosearchControlsRegion: '.someOther .selector'
          },
          controlsRegionLookup: {
            mapOptionControlsView: 'mapOptionControlsRegion',
            geosearchControlsView: 'geosearchControlsRegion'
          }
        });

        // Mock layout regions
        controlsController.mapOptionControlsRegion = new MockRegion();
        controlsController.geosearchControlsRegion = new MockRegion();

        // Mock controls
        mapOptionControls = new MockController();
        geosearchControls = new MockController();

        controlsController.renderControlsView(mapOptionControls, 'mapOptionControlsView');
        expect(controlsController.mapOptionControlsRegion.show).toHaveBeenCalledWith(mapOptionControls);

        controlsController.renderControlsView(geosearchControls, 'geosearchControlsView');
        expect(controlsController.geosearchControlsRegion.show).toHaveBeenCalledWith(geosearchControls);
      });

      it('should throw an error if the region doesn\'t exist', function() {
        var controller = new MapControlsController({
          eventHub: new Events(),
          builderOptions: new MockBuilderOptions(),
          controlsRegions: {}
        });
        var controls = new MockController();

        expect(function() {
          controller.renderControlsView(controls, 'someControlsView');
        }).toThrowType('InvalidArgumentError');
      });

    });

  });

});
