define([
  'aeris/util',
  'aeris/simplecollection',
  'aeris/simplemodel'
], function(_, SimpleCollection, SimpleModel) {

  describe('A SimpleCollection', function() {

    describe('at', function() {

      it('should return the model', function() {
        var collection = new SimpleCollection(['a', 'b', 'c']);
        expect(collection.at(1)).toEqual(collection.models[1]);
      });

    });

    describe('add', function() {

      it('should add a SimpleModel', function() {
        var model = new SimpleModel('foo');
        var collection = new SimpleCollection();
        collection.add(model);

        expect(collection.models[0]).toEqual(model);
        expect(collection.models.length).toEqual(1);
      });

      it('should not add two SimpleModels with the same value', function() {
        var modelOne = new SimpleModel('one');
        var model1 = new SimpleModel('one');
        var collection = new SimpleCollection();

        collection.add(modelOne);
        collection.add(model1);

        expect(collection.length).toEqual(1);
      });

      it('should not add two SimpleModels with the same value, at the same time', function() {
        var modelOne = new SimpleModel('one');
        var model1 = new SimpleModel('one');
        var collection = new SimpleCollection();

        collection.add('bar');
        collection.add([modelOne, model1]);

        expect(collection.length).toEqual(2);
      });

      it('should not add two of the same raw values', function() {
        var collection = new SimpleCollection();
        collection.add('bar');
        collection.add('foo');
        collection.add('foo');

        expect(collection.length).toEqual(2);

      });
      it('should not add two of the same raw values at the same time', function() {
        var collection = new SimpleCollection();
        collection.add('bar');
        collection.add(['foo', 'foo']);
        expect(collection.length).toEqual(2);
      });


      it('should add an arbitrary value as a SimpleModel', function() {
        var collection = new SimpleCollection();
        collection.add('foo');

        expect(collection.models[0]).toBeInstanceOf(SimpleModel);
        expect(collection.models[0].get('value')).toEqual('foo');
        expect(collection.models.length).toEqual(1);
      });
    });

    describe('reset', function() {

      it('should reset a collection, with raw values', function() {
        var collection = new SimpleCollection('one', 'two', 'three');
        collection.reset(['a', 'b', 'c']);

        expect(collection.toJSON()).toEqual(['a', 'b', 'c']);
      });

    });

    describe('remove', function() {

      it('should remove a value', function() {
        var collection = new SimpleCollection(['a', 'b', 'c']);
        collection.remove('b');

        expect(collection.length).toEqual(2);
        expect(collection.toJSON().indexOf('b')).toEqual(-1);
      });

      it('should remove a model', function() {
        var model = new SimpleModel('b');
        var collection = new SimpleCollection(['a', model, 'c', 'd']);

        collection.remove(['a', model, 'd']);

        // Only 'c' is left
        expect(collection.toJSON()).toEqual(['c']);
      });

      it('should do nothing if the model doesn\'t exist', function() {
        var collection = new SimpleCollection(['a', 'b', 'c']);
        collection.remove(['a', 'c', 'x']);

        expect(collection.toJSON()).toEqual(['b']);
      });

      it('should remove multiple instances of the same value', function() {
        var collection = new SimpleCollection(['a', 'b', 'a', 'c', 'b']);
        collection.remove(['a', 'b']);

        expect(collection.toJSON()).toEqual(['c']);
      });

    });

    describe('integration', function() {

      it('should trigger events', function() {
        var collection = new SimpleCollection(['a', 'b', 'c', 'd']);
        var listeners = jasmine.createSpyObj('listeners', [
          'add',
          'remove',
          'reset'
        ]);
        var model = new SimpleModel('foo');

        _.each(listeners, function(spy, topic) {
          collection.on(topic, spy);
        });

        collection.add(model);
        expect(listeners.add).toHaveBeenCalledWithSomeOf(model, collection);

        collection.remove('foo');
        expect(listeners.remove).toHaveBeenCalledWithSomeOf(model, collection);

        collection.reset('yo', 'jo');
        expect(listeners.reset).toHaveBeenCalledWithSomeOf(collection);
      });

    });

  });
});
