define([
  'aeris',
  'jasmine',
  'aeris/events',
  'testUtils',
  'testErrors/untestedspecerror'
], function(aeris, jasmine, Events, testUtils, UntestedSpecError) {
  describe('Aeris Events', function() {



    var Person = function() {
      Events.apply(this);
    };

    aeris.inherits(Person, Events);

    Person.prototype.talk = function(words) {
      this.trigger('talk', words);
    };
    Person.prototype.eavesdrop = function() {};


    describe('listenTo', function() {
      it('should bind handler to object events', function() {
        var talker = new Person();
        var busybody = new Person();

        spyOn(busybody, 'eavesdrop');

        busybody.listenTo(talker, 'talk', busybody.eavesdrop);
        talker.talk('juicy gossip');

        expect(busybody.eavesdrop).toHaveBeenCalledWith('juicy gossip');
      });

      it('should bind named handler to object', function() {
        var talker = new Person();
        var busybody = new Person();

        spyOn(busybody, 'eavesdrop');

        busybody.listenTo(talker, 'talk', 'eavesdrop');
        talker.talk();

        expect(busybody.eavesdrop).toHaveBeenCalled();
      });

      it('should not bind events to objects that don\'t extend from Events', function() {
        var SomeObj = function() {};
        var busybody = new Person();

        expect(function() {
          busybody.listenTo(SomeObj, 'do object things', busybody.eavesdrop);
        }).toThrowType('InvalidArgumentError');
      });

      it('should call bound events in the context of listener', function() {
        var talker = new Person();
        var busybody = new Person();

        spyOn(busybody, 'eavesdrop');

        busybody.listenTo(talker, 'talk', busybody.eavesdrop);
        talker.talk();

        expect(busybody.eavesdrop).toHaveBeenCalledInTheContextOf(busybody);
      });
    });

    describe('stopListening', function() {
      var talker, walker, busybody;

      beforeEach(function() {
        talker = new Person();
        busybody = new Person();
        walker = new Person();

        // Create spies
        spyOn(busybody, 'eavesdrop');
        walker.walk = jasmine.createSpy('walk').andCallFake(function() {
          this.trigger('walk');
        });
        busybody.watch = jasmine.createSpy('watch');
      });



      it('should clear listeners from all objects', function() {
        busybody.listenTo(talker, 'talk', busybody.eavesdrop);
        busybody.listenTo(walker, 'walk', busybody.watch);

        busybody.stopListening();

        talker.talk();
        walker.walk();

        expect(busybody.eavesdrop).not.toHaveBeenCalled();
        expect(busybody.watch).not.toHaveBeenCalled();
      });

      it('should clear all listeners bound to a specified object', function() {
        busybody.listenTo(talker, 'talk', busybody.eavesdrop);
        busybody.stopListening(talker);
        talker.talk();

        expect(busybody.eavesdrop).not.toHaveBeenCalled();
      });

      it('should not effect listeners bound to other objects', function() {
        // bind events
        busybody.listenTo(talker, 'talk', busybody.eavesdrop);
        busybody.listenTo(walker, 'walk', busybody.watch);

        // unbind from talker only
        busybody.stopListening(talker);

        // Test: only listening to walker
        talker.talk();
        walker.walk();
        expect(busybody.eavesdrop).not.toHaveBeenCalled();
        expect(busybody.watch).toHaveBeenCalled();
      });
    });

    describe('Binding events', function() {
      var updateStuff, updateThings, destroyEverything;
      var eventsHash;
      var listener, actor, someCtx;

      beforeEach(function() {
        listener = new Events();
        actor = new Events();
        someCtx = { foo: 'bar' };

        // Some handler spies to play with
        updateStuff = jasmine.createSpy('updateStuff');
        updateThings = jasmine.createSpy('updateThings');
        destroyEverything = jasmine.createSpy('destroyEverything');

        eventsHash = {
          remove: destroyEverything,
          change: [
            updateStuff,
            updateThings
          ]
        };
      });

      it('should bind an events hash', function() {
        spyOn(actor, 'on');

        listener.bindEvents(eventsHash, actor, someCtx);
        expect(actor.on).toHaveBeenCalledWith('remove', destroyEverything, someCtx);
        expect(actor.on).toHaveBeenCalledWith('change', updateStuff, someCtx);
        expect(actor.on).toHaveBeenCalledWith('change', updateThings, someCtx);
      });

      it('should unbind an events hash', function() {
        spyOn(actor, 'off');

        listener.unbindEvents(eventsHash, actor, someCtx);
        expect(actor.off).toHaveBeenCalledWith('remove', destroyEverything, someCtx);
        expect(actor.off).toHaveBeenCalledWith('change', updateStuff, someCtx);
        expect(actor.off).toHaveBeenCalledWith('change', updateThings, someCtx);
      });

      it('should default to \'this\' as the target object and context', function() {
        spyOn(listener, 'on');
        spyOn(listener, 'off');

        listener.bindEvents(eventsHash);
        expect(listener.on).toHaveBeenCalledWith('remove', destroyEverything, listener);
        expect(listener.on).toHaveBeenCalledWith('change', updateStuff, listener);
        expect(listener.on).toHaveBeenCalledWith('change', updateThings, listener);

        listener.unbindEvents(eventsHash);
        expect(listener.off).toHaveBeenCalledWith('remove', destroyEverything, listener);
        expect(listener.off).toHaveBeenCalledWith('change', updateStuff, listener);
        expect(listener.off).toHaveBeenCalledWith('change', updateThings, listener);
      });
    });
  });
});
