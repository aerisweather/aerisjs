define([
  'aeris/util',
  'aeris/events',
  'aeris/model',
  'aeris/collection',
  'jquery',
  'aeris/builder/routes/routebuilder/controllers/saveroutecontroller'
], function(_, Events, Model, Collection, $, SaveRouteController) {

  function stubMethodsFor(obj, methods, opt_name) {
    var name = opt_name || _.uniqueId('stub_');

    _.extend(obj, jasmine.createSpyObj(name, methods));
  }

  var MockRoute = function() {
    Collection.apply(this, arguments);
  };
  _.inherits(MockRoute, Collection);


  var MockRouteBuilder = function() {
    var stubbedMethods = [
      'routeToJSON',
      'getRoute'
    ];

    stubMethodsFor(this, stubbedMethods, 'routeBuilder');
  };


  var MockEventHub = function() {
    Events.call(this);
  };
  _.extend(MockEventHub.prototype, Events.prototype);


  var MockRouteModel = function() {
    Model.apply(this, arguments);
  };
  _.inherits(MockRouteModel, Model);


  function getTemplateStub() {
    var $el = $('<div></div>').
      append('<input id="nameInput" />').
      append('<input id="descrInput" />').
      append('<button id="saveBtn" />').
      append('<button id="closeBtn" />');

    return $el;
  }


  function saveRouteControllerFactory() {
    return new SaveRouteController({
      template: getTemplateStub(),
      routeBuilder: new MockRouteBuilder(),
      eventHub: new MockEventHub(),
      RouteModel: MockRouteModel,
      ui: {
        nameInput: '#nameInput',
        descrInput: '#descrInput',
        saveBtn: '#saveBtn',
        closeBtn: '#closeBtn'
      }
    });
  }


  describe('A SaveRouteController', function() {
    var controller;
    var routeBuilder, eventHub;

    beforeEach(function() {
      routeBuilder = new MockRouteBuilder();
      eventHub = new MockEventHub();
      controller = new SaveRouteController({
        template: getTemplateStub(),
        routeBuilder: routeBuilder,
        eventHub: eventHub,
        RouteModel: MockRouteModel,
        ui: {
          nameInput: '#nameInput',
          descrInput: '#descrInput',
          saveBtn: '#saveBtn',
          closeBtn: '#closeBtn'
        }
      })

      routeBuilder.getRoute.andReturn(new MockRoute());
    });


    describe('UI Bindings', function() {
      var $saveBtn, $closeBtn, $nameInput, $descrInput;

      beforeEach(function() {
        controller.render();

        $saveBtn = controller.ui.saveBtn;
        $closeBtn = controller.ui.closeBtn;
        $nameInput = controller.ui.nameInput;
        $descrInput = controller.ui.descrInput;
      });



      describe('Click the save button', function() {
        var STUB_ROUTE_EXPORT, STUB_NAME, STUB_DESCR;

        beforeEach(function() {
          STUB_NAME = 'STUB_ROUTE_NAME';
          STUB_DESCR = 'STUB_ROUTE_DESCRIPTION';
          STUB_ROUTE_EXPORT = ['pointA', 'pointB'];

          $nameInput.val(STUB_NAME);
          $descrInput.val(STUB_DESCR);

          routeBuilder.routeToJSON.andReturn(STUB_ROUTE_EXPORT);
        });


        it('should publish the exported route data', function() {
          var onRouteSave = jasmine.createSpy('onRouteSave');
          eventHub.on('route:export', onRouteSave);

          $saveBtn.click();

          expect(onRouteSave).toHaveBeenCalledWith({
            name: STUB_NAME,
            description: STUB_DESCR,
            route: STUB_ROUTE_EXPORT
          })
        });

        it('should validate the exported route using the RouteModel', function() {
          spyOn(MockRouteModel.prototype, 'isValid');

          $saveBtn.click();

          expect(MockRouteModel.prototype.isValid).toHaveBeenCalled();
        });
      });

      describe('Click the close button', function() {

        beforeEach(function() {
          spyOn(controller, 'close');
        });


        it('should close the view', function() {
          $closeBtn.click();

          expect(controller.close).toHaveBeenCalled();
        });

      });

    });

  });

});
