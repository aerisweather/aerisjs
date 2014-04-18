define([
  'aeris/util',
  'jasmine',
  'aeris/events',
  'testUtils',
  'testErrors/untestedspecerror',
  'backbone'
], function(_, jasmine, Events, testUtils, UntestedSpecError, Backbone) {
  describe('Aeris Events', function() {



    var Person = function() {
      Events.apply(this);
    };

    _.inherits(Person, Events);

    Person.prototype.talk = function(words) {
      this.trigger('talk', words);
    };
    Person.prototype.eavesdrop = function() {};

    describe('off', function() {
    });

    describe('Event hash', function() {
      var evtObj;
      var someCtx = { foo: 'bar' };

      beforeEach(function() {
        evtObj = new Events();

        evtObj.doSomething = jasmine.createSpy('doSomething');
        evtObj.anotherThing = jasmine.createSpy('anotherThing');

        eventsHash = {
          remove: jasmine.createSpy('removeHandler'),
          change: [
            'doSomething',
            evtObj.anotherThing
          ]
        };
      });

      afterEach(function() {
        evtObj.off();
      });

      it('should accept multiple handler binding a single event', function() {
        spyOn(Backbone.Events, 'on').andCallThrough();
        evtObj.on(eventsHash, someCtx);

        expect(Backbone.Events.on).toHaveBeenCalledWith('remove', eventsHash.remove, someCtx);
        expect(Backbone.Events.on).toHaveBeenCalledWith('change', evtObj.doSomething, someCtx);
        expect(Backbone.Events.on).toHaveBeenCalledWith('change', evtObj.anotherThing, someCtx);
      });

      it('should accept multiple handler for unbinding a single event', function() {
        spyOn(Backbone.Events, 'off').andCallThrough();
        evtObj.off(eventsHash, someCtx);

        expect(Backbone.Events.off).toHaveBeenCalledWith('remove', eventsHash.remove, someCtx);
        expect(Backbone.Events.off).toHaveBeenCalledWith('change', evtObj.doSomething, someCtx);
        expect(Backbone.Events.off).toHaveBeenCalledWith('change', evtObj.anotherThing, someCtx);
      });
    });

    it('should proxy events to another object', function() {
      var authentic = new Events();
      var poser = new Events();
      var authenticHandler = jasmine.createSpy('authenticHandler');
      var poserHandler = jasmine.createSpy('poserHandler');
      var message = {
        foo: 'bar'
      };

      poser.proxyEvents(authentic);

      authentic.on('keepingItReal', authenticHandler);
      poser.on('keepingItReal', poserHandler);

      authentic.trigger('keepingItReal', message);

      expect(authenticHandler).toHaveBeenCalledWith(message);
      expect(poserHandler).toHaveBeenCalledWith(message);

      // And what if the poser calls the event itself?
      poser.trigger('keepingItReal', 'just fake it til you make it');
      // Acts just like normal
      expect(poserHandler).toHaveBeenCalledWith('just fake it til you make it');
      // And the original Event object doesn't get called
      expect(authenticHandler.callCount).toEqual(1);
    });

    it('should customize the proxy event with using a callback', function() {
      var child = new Events();
      var parent = new Events();

      parent.proxyEvents(child, function(topic, args) {
        return {
          topic: 'child:' + topic,
          args: [child].concat(args)
        };
      }, parent);

      spyOn(parent, 'trigger');

      child.trigger('grow', '3 inches');

      expect(parent.trigger).toHaveBeenCalledWith('child:grow', child, '3 inches');
    });

    it('should end a proxy', function() {
      var authentic = new Events();
      var poser = new Events();
      var authenticHandler = jasmine.createSpy('authenticHandler');
      var poserHandler = jasmine.createSpy('poserHandler');

      poser.proxyEvents(authentic);
      authentic.removeProxy();

      authentic.on('keepingItReal', authenticHandler);
      poser.on('keepingItReal', poserHandler);

      authentic.trigger('keepingItReal');
      expect(authenticHandler).toHaveBeenCalled();
      expect(poserHandler).not.toHaveBeenCalled();
    });

    describe('global events', function() {

      it('should publish and subscribe to global events', function() {
        var subSpy = jasmine.createSpy('handler');

        Events.subscribe('topic', subSpy);
        Events.publish('topic', 'foo', 'bar');

        expect(subSpy).toHaveBeenCalledWith('foo', 'bar');
      });
    });
  });
});
