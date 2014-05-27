define([
  'aeris/util',
  'aeris/maps/extensions/mapobjectcollection',
  'aeris/model'
], function(_, MapObjectCollection, Model) {

  var MockMap = function() {
  };

  var MockMapObject = function() {
    Model.apply(this, arguments);

    spyOn(this, 'setMap').andCallThrough();
  };
  _.inherits(MockMapObject, Model);

  MockMapObject.prototype.setMap = function(map, opt_options) {
    var event = _.isNull(map) ? 'map:remove' : 'map:set';
    var options = opt_options || {};

    this.set('map', map);

    if (!options.silent) {
     this.trigger(event, this, map);
    }
  };


  function resetSetMapSpiesFor(children) {
    _.each(children, function(child) {
      child.setMap = jasmine.createSpy('setMap');
    });
  }


  describe('A MapObjectCollection', function() {

    describe('setMap', function() {
      var collection;

      function shouldHaveSetMapOnChildren(map, children) {
        _.each(children, function(child) {
          var mapArg = child.setMap.mostRecentCall.args[0];
          expect(mapArg).toEqual(map);
        });
      }

      beforeEach(function() {
        collection = new MapObjectCollection();
      });


      it('should set the map on any existing MapObjects', function() {
        var map = new MockMap();
        var children = [new MockMapObject(), new MockMapObject()];
        collection.add(children);

        collection.setMap(map);

        shouldHaveSetMapOnChildren(map, children);
      });

      it('should set the map on all children, even if the map has already been set', function() {
        var map = new MockMap();
        var children = [new MockMapObject(), new MockMapObject()];
        collection.add(children);
        collection.setMap(map);

        resetSetMapSpiesFor(children);

        collection.setMap(map);

        shouldHaveSetMapOnChildren(map, children);
      });


      describe('Events', function() {
        var listener;

        beforeEach(function() {
          listener = jasmine.createSpy('listener');
        });


        it('should trigger a \'map:set\' event, if the map is not null', function() {
          var map = new MockMap();
          collection.on('map:set', listener);

          collection.setMap(map);

          expect(listener).toHaveBeenCalledWith(collection, map);
          expect(listener.callCount).toEqual(1);
        });

        it('should not trigger a \'map:set\' event twice for the same map', function() {
          var map = new MockMap();
          collection.setMap(map);
          collection.on('map:set', listener);

          collection.setMap(map);

          expect(listener).not.toHaveBeenCalled();
        });

        it('should trigger a \'map:remove\' event, if the map is null', function() {
          collection.on('map:remove', listener);

          collection.setMap(null);

          expect(listener).toHaveBeenCalledWith(collection, null);
        });

        it('should not trigger a \'map:remove\' if the map is already set to null', function() {
          collection.setMap(null);
          collection.on('map:remove', listener);

          collection.setMap(null);

          expect(listener).not.toHaveBeenCalled();
        });

        it('should trigger a only one \'map:set\' event', function() {
          collection.add([new MockMapObject(), new MockMapObject(), new MockMapObject()]);
          collection.on('map:set', listener);

          collection.setMap(new MockMap());

          expect(listener.callCount).toEqual(1);
        });

        it('should trigger only one \'map:remove\' event', function() {
          collection.add([new MockMapObject(), new MockMapObject(), new MockMapObject()]);
          collection.on('map:remove', listener);

          collection.setMap(null);

          expect(listener.callCount).toEqual(1);
        });

      });

    });


    describe('getMap', function() {
      var collection, map;

      beforeEach(function() {
        collection = new MapObjectCollection();
        collection.setMap(map);
      });


      it('should return the map set using setMap', function() {
        expect(collection.getMap()).toEqual(map);
      });

    });


    describe('hasMap', function() {
      var collection;

      beforeEach(function() {
        collection = new MapObjectCollection();
      });


      it('should return true if the map is not null', function() {
        collection.setMap(new MockMap());

        expect(collection.hasMap()).toEqual(true);
      });


      it('should return false if the map is null', function() {
        collection.setMap(null);

        expect(collection.hasMap()).toEqual(false);
      });

    });


    describe('add', function() {
      var collection, map;

      beforeEach(function() {
        map = new MockMap();
        collection = new MapObjectCollection();
        collection.setMap(map);
      });


      it('should set the MapObject\'s map to the collections map', function() {
        var addedChild = new MockMapObject();
        collection.add(addedChild);

        expect(addedChild.setMap).toHaveBeenCalledWith(map);
      });

      it('should not bubble a map:set events from added children', function() {
        var mapSetListener = jasmine.createSpy('mapSetListener');
        collection.on('map:set', mapSetListener);

        collection.add(new MockMapObject());
        expect(mapSetListener).not.toHaveBeenCalled();
      });

      it('should not bubble a map:remove events from added children', function() {
        var mapRemoveListener = jasmine.createSpy('mapRemoveListener');
        collection.setMap(null);
        collection.on('map:remove', mapRemoveListener);

        collection.add(new MockMapObject());
        expect(mapRemoveListener).not.toHaveBeenCalled();
      });

      it('should allow children to trigger \'map:*\' events', function() {
        var child = new MockMapObject();
        var map = new MockMap();
        var onChildMapSet = jasmine.createSpy('onChildMapSet');
        var onChildMapRemove = jasmine.createSpy('onChildMapRemove');

        collection.setMap(map);
        child.on({
          'map:set': onChildMapSet,
          'map:remove': onChildMapRemove
        });

        collection.add(child);
        expect(onChildMapSet).toHaveBeenCalledWith(child, map);

        collection.setMap(null);
        expect(onChildMapRemove).toHaveBeenCalledWith(child, null);
      });

    });


    describe('remove', function() {
      var collection, map, child;

      beforeEach(function() {
        child = new MockMapObject();
        map = new MockMap();
        collection = new MapObjectCollection();
        collection.add(child);

        resetSetMapSpiesFor([child]);
      });



      it('should set the MapObject\'s map to null', function() {
        collection.remove(child);

        expect(child.setMap).toHaveBeenCalledWith(null);
      });

    });

  });

});
