define(['aeris', 'base/markerstrategy', 'gmaps/utils'], function(aeris) {

  /**
   * @fileoverview Icon marker strategy for Google Maps.
   */


  aeris.provide('aeris.maps.gmaps.markerstrategies.Icon');


  /**
   * A strategy for support of an Icon marker with Google Maps.
   *
   * @constructor
   * @extends {aeris.maps.MarkerStrategy}
   */
  aeris.maps.gmaps.markerstrategies.Icon = function() {
    aeris.maps.MarkerStrategy.call(this);
  };
  aeris.inherits(aeris.maps.gmaps.markerstrategies.Icon,
                 aeris.maps.MarkerStrategy);


  /**
   * @override
   */
  aeris.maps.gmaps.markerstrategies.Icon.prototype.setMarker =
      function(marker, map) {

    var gmarker = new google.maps.Marker({
      position: aeris.maps.gmaps.utils.arrayToLatLng(marker.position),
      icon: {
        url: marker.url,
        anchor: new google.maps.Point(marker.width / 2, marker.height / 2)
      },
      clickable: !!marker.click,
      flat: true
    });

    if (marker.click)
      google.maps.event.addListener(gmarker, 'click', marker.click);

    gmarker.setMap(map);

    return gmarker;
  };


  return aeris.maps.gmaps.markerstrategies.Icon;

});
