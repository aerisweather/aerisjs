define([
  'aeris/util',
  'aeris/maps/markers/marker'
], function(_, Marker) {
  return function getMarkers(count, opt_position, opt_options) {
    var options = _.defaults(opt_options || {}, {
      type: false
    });
    var positions = [];
    var basePos = opt_position || [45, -120];

    _.times(count, function(i) {
      var offsetX = Math.random() > 0.5 ? Math.random() : Math.random() * -1;
      var offsetY = Math.random() > 0.5 ? Math.random() : Math.random() * -1;

      positions.push([basePos[0] + offsetX * 0.1, basePos[1] + offsetY * 0.1]);
    });

    return positions.map(function(pos) {
      var marker;
      var markerOptions = {
        position: pos
      };
      if (options.url) {
        markerOptions.url = options.url;
      }
      marker = new Marker(markerOptions);

      if (options.type) {
        marker.getType = _.constant(options.type);
      }

      return marker;
    });
  }
});
