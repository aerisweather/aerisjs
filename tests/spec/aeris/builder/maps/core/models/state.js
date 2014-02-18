define([
  'aeris/util',
  'aeris/events',
  'sinon',
  'aeris/builder/maps/core/models/state',
  'aeris/builder/maps/core/collections/mapobjecttogglecollection'
], function(_, Events, sinon, State, MapObjectToggleCollection) {
  var MockMapObjectStateCollection = function() {
    Events.call(this);
  };
  _.inherits(MockMapObjectStateCollection, MapObjectToggleCollection);

  // Stub out methods
  MockMapObjectStateCollection.prototype = sinon.createStubInstance(MapObjectToggleCollection);

  // Spy on methods
  _.extend(MockMapObjectStateCollection.prototype, jasmine.createSpyObj('MockCollection', [
    'set',
    'toJSON'
  ]));

  // Mixin events obj
  _.extend(MockMapObjectStateCollection.prototype, Events.prototype);



  describe('A MapBuilder state', function() {

    describe('set', function() {

      it('should work like normal, for non-collection values', function() {
        // Clearly not a comprehensive spec of the original
        // BB.Model#set, but hopefully enough to keep us out of trouble.

        var state = new State();
        var spies = jasmine.createSpyObj('spies', [
          'changeFoo'
        ]);

        // Set using (key, value)
        state.set('foo', 'bar');
        expect(state.get('foo')).toEqual('bar');

        // Change attr using (key, value)
        state.on('change:foo', spies.changeFoo);
        state.set('foo', 'whatever');
        expect(spies.changeFoo).toHaveBeenCalled();
        expect(state.get('foo')).toEqual('whatever');

        // Set and change attr using ({ key: value, ...});
        state.set({
          foo: 'whiz',
          hello: 'world'
        });
        expect(state.get('foo')).toEqual('whiz');
        expect(state.get('hello')).toEqual('world');
        expect(spies.changeFoo).toHaveBeenCalled();
      });

      it('should set nested collections values using key/value syntax', function() {
        var state = new State();
        var collection = new MockMapObjectStateCollection();

        // Setting for the first time
        state.set('mapObjects', collection);
        expect(state.get('mapObjects')).toEqual(collection);

        // Now let's change a nested attribute
        state.set('mapObjects', ['foo', 'bar']);
        expect(collection.set).toHaveBeenCalledWith(['foo', 'bar']);
      });

      it('should set nested collection values using object syntax', function() {
        var collections = [new MockMapObjectStateCollection(), new MockMapObjectStateCollection()];
        var state = new State();

        // Setting the first collection
        state.set({
          mapObjA: collections[0]
        });


        state.set({
          mapObjA: ['foo', 'bar'],      // Update
          mapObjB: collections[1]       // set up
        });
        expect(collections[0].set).toHaveBeenCalledWith(['foo', 'bar']);
        expect(state.get('mapObjB')).toEqual(collections[1]);
      });

      it('should trigger change events on nested collection changes', function() {
        var state = new State();
        var collection = new MockMapObjectStateCollection();
        var spies = jasmine.createSpyObj('spies', [
          'change',
          'changeAttr'
        ]);

        state.set('mapObj', collection);
        state.on({
          change: spies.change,
          'change:mapObj': spies.changeAttr
        });

        // Should listen to all of these events
        _.each(['add', 'remove', 'change', 'reset'], function(topic, count) {
          collection.trigger(topic);
          expect(spies.change.callCount).toEqual(count + 1);
          expect(spies.changeAttr.callCount).toEqual(count + 1);
        });

        // Check args
        expect(spies.change).toHaveBeenCalledWithSomeOf(state);
        expect(spies.changeAttr).toHaveBeenCalledWithSomeOf(state, collection);
      });

      it('should maintain change events after nested collection changes', function() {
        var state = new State();
        var collection = new MockMapObjectStateCollection();
        var spy = jasmine.createSpy('change');

        state.set('mapObj', collection);

        state.on('change', spy);

        state.set('mapObj', ['foo', 'bar']);
        collection.trigger('add');
        expect(spy).toHaveBeenCalled();
        expect(spy.callCount).toEqual(1);

        state.set('mapObj', ['waz', 'baz']);
        collection.trigger('remove');
        expect(spy.callCount).toEqual(2);
      });

      it('should clean up zombie events', function() {
        var state = new MockMapObjectStateCollection();
        var collections = [new MockMapObjectStateCollection(), new MockMapObjectStateCollection()];
        var zombieSpy = jasmine.createSpy('zombie');

        state.set('mapObj', collections[0]);
        state.on('change', zombieSpy);

        // Switch the collections
        state.set('mapObj', collections[1]);

        // Trigger event on removed collection
        collections[0].trigger('all');
        expect(zombieSpy).not.toHaveBeenCalled();
      });

    });

    describe('toJSON', function() {

      it('should serialize nested collections', function() {
        var state = new State();
        var collection = new MockMapObjectStateCollection();

        collection.toJSON.andReturn(['foo', 'bar']);

        state.set({
          mapObj: collection
        });

        expect(state.toJSON().mapObj).toEqual(['foo', 'bar']);
        expect(collection.toJSON).toHaveBeenCalled();
      });

    });

  });

});
