define(["aeris", "base/layer"], function(aeris) {

  aeris.provide("aeris.maps.gmaps.layers.GoogleRoadMap");

  aeris.maps.gmaps.layers.GoogleRoadMap = function() {};
  aeris.inherits(aeris.maps.gmaps.layers.GoogleRoadMap, aeris.maps.Layer);

  aeris.extend(aeris.maps.gmaps.layers.GoogleRoadMap.prototype, {
    setMap: function(map) {
      map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    }
  });

  return aeris.maps.gmaps.layers.GoogleRoadMap;
});
