/**
 * @fileoverview Defines a mock google.maps.DirectionsResult object.
*/
define(['mocks/waypoint', 'underscore', 'googlemaps'], function(MockWaypoint, _) {
  var DirectionsResult = function() {
    return {
      routes: [
        {
          overview_path: (function() {
            // steal a fake path from the MockWaypoint class
            var wp = new MockWaypoint();
            var gLatLngs = [];
            _.each(wp.path, function(latLng) {
              gLatLngs.push(new google.maps.LatLng(latLng[0], latLng[1]));
            });

            return gLatLngs;
          })(),
          legs: [
            {
              distance: {
                text: '6.21 miles',
                value: 10000
              }
            }
          ]
        }
      ]
    };
  };

  return DirectionsResult;
});

