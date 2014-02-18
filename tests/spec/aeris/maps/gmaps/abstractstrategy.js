define([
  'aeris/util',
  'aeris/maps/strategy/abstractstrategy',
  'aeris/model'
], function(_, AbstractStrategy, Model) {

  var MockObject = function() {
    Model.apply(this, arguments);
  };
  _.inherits(MockObject, Model);
  MockObject.prototype.hasMap = jasmine.createSpy('MockObject#hasMap');


  var MockGoogleEvents = function() {
  };
  MockGoogleEvents.prototype.listenTo = jasmine.createSpy('MockGoogleEvents#listenTo');
  MockGoogleEvents.prototype.stopListening = jasmine.createSpy('MockGoogleEvents#stopListening');


  describe('A Google Maps AbstractStrategy', function() {

    describe('destroy', function() {

      it('should clean up google maps events', function() {
        var gEvents = new MockGoogleEvents();
        var strategy = new AbstractStrategy(new MockObject(), {
          googleEvents: gEvents
        });

        strategy.destroy();
        expect(gEvents.stopListening).toHaveBeenCalled();
      });

    });

  });

});
