define(function() {
  var styleString = '' +
    '.aeris-cluster:after {' +
    '  content: "";' +
    '  position: absolute;' +
    '  top: -11px;' +
    '  right: -14px;' +
    '  width: 21px;' +
    '  height: 18px;' +
    '  background-image: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #a90329), color-stop(44%, #8f0222), color-stop(100%, #6d0019));' +
    '  background-image: -webkit-linear-gradient(top, #a90329 0%, #8f0222 44%, #6d0019 100%);' +
    '  background-image: -moz-linear-gradient(top, #a90329 0%, #8f0222 44%, #6d0019 100%);' +
    '  background-image: -o-linear-gradient(top, #a90329 0%, #8f0222 44%, #6d0019 100%);' +
    '  background-image: linear-gradient(top, #a90329 0%, #8f0222 44%, #6d0019 100%);' +
    '  -webkit-border-radius: 5px;' +
    '  -moz-border-radius: 5px;' +
    '  -ms-border-radius: 5px;' +
    '  -o-border-radius: 5px;' +
    '  border-radius: 5px;' +
    '  border: 1px solid rgba(0, 0, 0, 0.5);' +
    '}' +
    '' +
    '.aeris-cluster div {' +
    '  z-index: 2;' +
    '}';

  /**
   * Returns CSS style rules for gmaps
   * marker clusters.
   *
   * @for aeris.maps.gmaps.markers
   * @method markerClusterStyleTemplate
   * @return {String}
   */
  return function markerClusterStyleTemplate() {
    return styleString;
  }
});
