define([
  'base/markercollections/apiendpoint',
  'base/marker',
  'mocks/map',
  'aeris/promise'
], function(APIEndpoint, Marker, MockMap, Promise) {

  describe('An aeris.maps.markercollections.APIEndpoint', function() {

    var collection = null;

    beforeEach(function() {
      collection = new APIEndpoint();
    });

    it('should be initialized after the markers are fetched', function() {
      var initialized = false;
      collection.initialized.done(function() {
        initialized = true;
      });
      collection.trigger('fetch');

      expect(initialized).toEqual(true);
    });

    describe('after being set to a map', function() {

      var map = null;

      it('should reset the markers when new data is fetched', function() {
        map = MockMap();
        collection.setMap(map);

        spyOn(collection, 'clear');
        spyOn(collection, 'setMap');

        collection.trigger('fetch');

        expect(collection.clear).toHaveBeenCalled();
        expect(collection.setMap).toHaveBeenCalled();
      });

      it('should fetch the markers when the map bounds change', function() {
        spyOn(collection, 'fetch');

        map = MockMap();
        collection.setMap(map);

        map.options.trigger('change:bounds');

        expect(collection.fetch).toHaveBeenCalled();
      });
    });

    describe('after clearing markers from the map', function() {

      var map = null;

      it('should not reset the markers when new data is fetched', function() {
        map = MockMap();
        collection.setMap(map);
        collection.clear();

        spyOn(collection, 'clear');
        spyOn(collection, 'setMap');

        collection.trigger('fetch');

        expect(collection.clear).not.toHaveBeenCalled();
        expect(collection.setMap).not.toHaveBeenCalled();
      });

      it('should not fetch the markers when the map bounds change', function() {
          spyOn(collection, 'fetch');

          map = MockMap();
          collection.setMap(map);
          collection.clear();

          map.options.trigger('change:bounds');

          expect(collection.fetch).not.toHaveBeenCalled();
      });
    });

    describe('fetch method', function() {

      describe('on gathering from cache', function() {

        var markers = null;

        beforeEach(function() {
          markers = [];
          for (var i = 0; i < 5; i++) {
            var marker = new Marker();
            markers.push(marker);
            collection.add(marker);
          }
        });

        it('should resolve the returned promise with the previous markers', function() {
          var fetchMarkers = null;
          collection.fetch(false).done(function(markers) {
            fetchMarkers = markers;
          });

          expect(fetchMarkers).toEqual(markers);
        });

        it('should trigger the fetch event with the previous markers', function() {
          var fetchMarkers = null;
          function fn(markers) {
            fetchMarkers = markers;
            collection.off('fetch', fn);
          };
          collection.on('fetch', fn);
          collection.fetch(false);

          expect(fetchMarkers).toEqual(markers);
        });
      });

      describe('on success', function() {
        var dataPromise = new Promise();
        var data = {'just': ['some', 'json'], 'data': null};
        var markers = [{'a': 'marker'}, {'and': 'another'}, {'just': 1, 'more': null}];

        it('should call fetchMarkerData() and parseMarkerData() on success', function() {
          spyOn(collection, 'fetchMarkerData').andReturn(dataPromise);
          spyOn(collection, 'parseMarkerData');

          collection.fetch();
          dataPromise.resolve(data);

          expect(collection.fetchMarkerData).toHaveBeenCalled();
          expect(collection.parseMarkerData).toHaveBeenCalledWith(data);
        });

        it('should resolve the returned promise with the markers', function() {
          spyOn(collection, 'fetchMarkerData').andReturn(dataPromise);
          spyOn(collection, 'parseMarkerData').andReturn(markers);

          var fetchMarkers = null;
          collection.fetch().done(function(markers) {
            fetchMarkers = markers;
          });
          dataPromise.resolve(data);

          expect(fetchMarkers).toEqual(markers);
        });

        it('should trigger the fetch event with the markers', function() {
          spyOn(collection, 'fetchMarkerData').andReturn(dataPromise);
          spyOn(collection, 'parseMarkerData').andReturn(markers);

          var fetchMarkers = null;
          function fn(markers) {
            fetchMarkers = markers;
            collection.off('fetch', fn);
          }
          collection.on('fetch', fn);
          collection.fetch();
          dataPromise.resolve(data);

          expect(fetchMarkers).toEqual(markers);
        });
      });
    });

  });

});
