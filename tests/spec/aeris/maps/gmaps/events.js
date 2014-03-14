define([
  'aeris/util',
  'aeris/maps/strategy/events'
], function(_, GoogleEvents) {
  var gEvent_orig;
  var root = this;

  root.google || (google = {});
  google.maps || (google.maps = {});
  google.maps.event || (google.maps.event = {});

  gEvent_orig = google.maps.event;

  beforeEach(function() {
    google.maps.event = jasmine.createSpyObj('google events', [
      'addListener',
      'removeListener'
    ]);
  });


  afterEach(function() {
    google.maps.event = gEvent_orig;
  });



  describe('A GoogleEvents object', function() {

    describe('listenTo', function() {

      it('should listen to an event', function() {
        var event = new GoogleEvents();
        var obj = { foo: 'bar' };
        var spy = jasmine.createSpy('listen');

        event.listenTo(obj, 'talk', spy);
        expect(google.maps.event.addListener).toHaveBeenCalledWith(obj, 'talk', spy);
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
        expect(google.maps.event.addListener).toHaveBeenCalledWith(obj, 'talk', spies.listen);
        expect(google.maps.event.addListener).toHaveBeenCalledWith(obj, 'dance', spies.watch);
        expect(google.maps.event.addListener).toHaveBeenCalledWith(obj, 'cook', spies.eat);
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
        google.maps.event.addListener.andCallFake(function(obj, topic, handler) {
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
        expect(google.maps.event.removeListener).toHaveBeenCalledWith(gListenerA);
        expect(google.maps.event.removeListener).not.toHaveBeenCalledWith(gListenerB);

        event.stopListening(objB);
        expect(google.maps.event.removeListener).toHaveBeenCalledWith(gListenerB);
      });

      it('should stop listening to all events', function() {
        event.stopListening();
        expect(google.maps.event.removeListener).toHaveBeenCalledWith(gListenerA);
        expect(google.maps.event.removeListener).toHaveBeenCalledWith(gListenerB);
      });

      it('should not attempt to remove the same listeners twice', function() {
        var baseRemoveListenerCount;

        event.stopListening();
        baseRemoveListenerCount = google.maps.event.removeListener.callCount;

        event.stopListening();
        expect(google.maps.event.removeListener.callCount).toEqual(baseRemoveListenerCount);
      });

    });

  });

});
