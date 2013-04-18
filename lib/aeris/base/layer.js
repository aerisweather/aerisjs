define(["aeris"], function(aeris) {

  var Layer = function() {
    this.layer = null;
  };

  Layer.prototype = {
    setMap: aeris.notImplemented('Layer.setMap')
  };

  return Layer;
});
