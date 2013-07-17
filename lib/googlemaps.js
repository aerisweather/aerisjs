/**
 * @fileoverview Define Google Maps API as a requirejs module.
 */
define('googlemaps', ['async!https://maps.googleapis.com/maps/api/js?key=AIzaSyDxTEbJsXwGRW4zDj8fpVsenDMMQGhZhUU&sensor=false'], function() {
  return window.google.maps;
});
