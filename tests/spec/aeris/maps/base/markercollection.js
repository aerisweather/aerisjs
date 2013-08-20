define([
  'base/markercollection',
  'base/marker',
  'mocks/map',
  'aeris/util'
], function(MarkerCollection, Marker, MockMap, _) {

  describe('A MarkerCollection', function() {

    var collection, count = null;

    beforeEach(function() {
      collection = new MarkerCollection();
      count = 5;
    });

    it('should get markers', function() {
      var markers = [];

      for (var i = 0; i < count; i++) {
        var marker = new Marker();
        markers.push(marker);
        collection.add(marker);
      }

      expect(collection.getMarkers()).toEqual(markers);
    });

    it('should allow a marker to be added', function() {
      var marker = new Marker();
      collection.add(marker);

      expect(_.indexOf(collection.getMarkers(), marker)).not.toEqual(-1);
    });

    it('should allow markers to be added', function() {
      for (var i = 0; i < count; i++) {
        collection.add(new Marker());
      }

      expect(collection.getMarkers().length).toEqual(count);
    });

    it('should allow marker to be removed', function() {
      var marker = new Marker();
      collection.add(marker);
      collection.remove(marker);

      expect(_.indexOf(collection.getMarkers(), marker)).toEqual(-1);
      expect(collection.getMarkers().length).toEqual(0);
    });

    it('should add markers to the map when set to a map', function() {
      spyOn(Marker.prototype, 'setMap');

      for (var i = 0; i < count; i++) {
        collection.add(new Marker());
      }

      var map = MockMap();
      collection.setMap(map);

      expect(Marker.prototype.setMap.calls.length).toEqual(count);
    });

    it('should remove markers from the map when cleared', function() {
      spyOn(Marker.prototype, 'setMap');
      spyOn(Marker.prototype, 'remove');

      for (var i = 0; i < count; i++) {
        collection.add(new Marker());
      }

      var map = MockMap();
      collection.setMap(map);
      collection.clear();

      expect(Marker.prototype.remove.calls.length).toEqual(count);
    });

  });
});
