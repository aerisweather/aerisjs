define([
  'aeris/util',
  'aeris/maps/strategy/events',
  'googlemaps!'
], function(_, GoogleEvents, gmaps) {



  describe('A GoogleEvents object', function() {

    beforeEach(function() {
      spyOn(gmaps.event, 'addListener');
      spyOn(gmaps.event, 'removeListener');
    });

    describe('listenTo', function() {

      it('should listen to an event', function() {
        var event = new GoogleEvents();
        var obj = { foo: 'bar' };
        var spy = jasmine.createSpy('listen');

        event.listenTo(obj, 'talk', spy);
        expect(gmaps.event.addListener).toHaveBeenCalledWith(obj, 'talk', spy);
      });

      it('should listen to multiple events', function() {
        var event = new GoogleEvents();
        var spies = jasmine.createSpyObj('handlers', ['listen', 'watch', 'eat']);
        var obj = { foo: 'bar' };

        event.listenTo(obj, {
          talk: spies.listen,
          dance: spies.watch,
          cook: spies.eat
        });
        expect(gmaps.event.addListener).toHaveBeenCalledWith(obj, 'talk', spies.listen);
        expect(gmaps.event.addListener).toHaveBeenCalledWith(obj, 'dance', spies.watch);
        expect(gmaps.event.addListener).toHaveBeenCalledWith(obj, 'cook', spies.eat);
      });

    });


    describe('stopListening', function() {
      var spies, event;
      var objA, objB;
      var gListenerA = { bar: 'foo' }, gListenerB = { jo: 'yo' };

      beforeEach(function() {
        objA = { foo: 'bar' };
        objB = { yo: 'jo' };

        event = new GoogleEvents();
        spies = jasmine.createSpyObj('handlers', ['listen', 'watch', 'eat', 'A', 'B', 'C']);

        // Mock addListener to return objects we can track;
        gmaps.event.addListener.andCallFake(function(obj, topic, handler) {
          if (obj === objA) { return gListenerA; }
          if (obj === objB) { return gListenerB; }

          throw Error('Unexpected arguments to addListener mock');
        });

        event.listenTo(objA, {
          talk: spies.listen,
          dance: spies.watch,
          cook: spies.eat
        });

        event.listenTo(objB, {
          one: spies.A,
          two: spies.B,
          three: spies.C
        });
      });

      it('should stop listening to events on an object', function() {
        event.stopListening(objA);
        expect(gmaps.event.removeListener).toHaveBeenCalledWith(gListenerA);
        expect(gmaps.event.removeListener).not.toHaveBeenCalledWith(gListenerB);

        event.stopListening(objB);
        expect(gmaps.event.removeListener).toHaveBeenCalledWith(gListenerB);
      });

      it('should stop listening to all events', function() {
        event.stopListening();
        expect(gmaps.event.removeListener).toHaveBeenCalledWith(gListenerA);
        expect(gmaps.event.removeListener).toHaveBeenCalledWith(gListenerB);
      });

      it('should not attempt to remove the same listeners twice', function() {
        var baseRemoveListenerCount;

        event.stopListening();
        baseRemoveListenerCount = gmaps.event.removeListener.callCount;

        event.stopListening();
        expect(gmaps.event.removeListener.callCount).toEqual(baseRemoveListenerCount);
      });

    });

  });

});
