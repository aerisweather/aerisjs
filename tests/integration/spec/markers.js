define([
  'aeris',
  'gmaps/map',
  'jquery',
  'testUtils',
  'testErrors/untestedspecerror',
  'googlemaps',
  'packages/gmaps/markers'
], function(aeris, AerisMap, $, testUtils, UntestedSpecError) {
  describe('The Markers Package for Google Maps', function() {
    var aerisMap;
    var $canvas = $('<div id="map-canvas"><div>');

    beforeEach(function() {
      $canvas.appendTo('body');

      aerisMap = new AerisMap('map-canvas', {
        center: [44.98, -93.2636],
        zoom: 15
      });

      waitsFor(function() {
        return aerisMap.initialized.state === 'resolved';
      });
    });

    afterEach(function() {
      $canvas.remove().empty();
      aerisMap = null;
    });

    function createIcon(opt_position, opt_options) {
      var position = opt_position || testUtils.getRandomLatLon();
      return new aeris.maps.markers.Icon(position, opt_options);
    }

    function getMarkerLatLng(marker) {
      return new google.maps.LatLng(marker.position[0], marker.position[1]);
    }



    it('should add a marker to a map', function() {
      var marker = createIcon();

      spyOn(google.maps.Marker.prototype, 'setMap');
      spyOn(google.maps.Marker.prototype, 'setPosition');

      runs(function() {
        marker.setMap(aerisMap);

        expect(google.maps.Marker.prototype.setMap).toHaveBeenCalledWith(aerisMap.map);
        expect(google.maps.Marker.prototype.setPosition).toHaveBeenCalledWith(
          getMarkerLatLng(marker)
        );
      });
    });

    it('should add multiple markers to a map', function() {
      var expectedSetPositionCalls = [];
      var count = 5;

      spyOn(google.maps.Marker.prototype, 'setMap');
      spyOn(google.maps.Marker.prototype, 'setPosition');

      runs(function() {
        for (var i = 0; i < count; i++) {
          var marker = createIcon();
          marker.setMap(aerisMap);
          expectedSetPositionCalls.push([getMarkerLatLng(marker)]);
        }

        expect(google.maps.Marker.prototype.setMap.callCount).toEqual(count);
        expect(google.maps.Marker.prototype.setPosition.argsForCall).toEqual(expectedSetPositionCalls);
      });
    });

    it('should remove a marker from a map', function() {
      var marker = createIcon();

      spyOn(google.maps.Marker.prototype, 'setMap');

      runs(function() {
        marker.setMap(aerisMap);
        marker.remove();

        expect(google.maps.Marker.prototype.setMap).toHaveBeenCalledWith(null);
      });
    });

    it('should remove multiple markers from a map', function() {
      var count = 5;

      spyOn(google.maps.Marker.prototype, 'setMap');

      runs(function() {
        var expectedCalls = google.maps.Marker.prototype.setMap.argsForCall;

        for (var i = 0; i < count; i++) {
          var marker = createIcon();
          marker.setMap(aerisMap);
          expectedCalls.push([[aerisMap.map]]);

          marker.remove();
          expectedCalls.push([[null]]);
        }

        expect(google.maps.Marker.prototype.setMap.argsForCall).toEqual(expectedCalls);
      });
    });
  });
});
