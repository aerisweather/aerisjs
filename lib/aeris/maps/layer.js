define(["aeris"], function(aeris) {

  aeris.provide("aeris.maps.Layer");

  aeris.maps.Layer = function() {
    this.layer = null;
  };

  aeris.maps.Layer.prototype = {
    setMap: aeris.notImplemented('Layer.setMap')
  };

  return aeris.maps.Layer;
});
