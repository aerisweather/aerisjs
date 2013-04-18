define(["aeris", "base/layer"], function(aeris, Layer) {

  aeris.layers.GoogleRoadMap = function() {};
  aeris.inherits(aeris.layers.GoogleRoadMap, Layer);

  aeris.extend(aeris.layers.GoogleRoadMap.prototype, {
    setMap: function(map) {
      map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    }
  });

  return aeris.layers.GoogleRoadMap;
});
