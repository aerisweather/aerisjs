

function preloadLayer(layer) {
  lyrQueue.push(layer);

  ensureQueueIsRunning();

}

function doPreload() {
  return promise;
}

function ensureQueueIsRunning() {

}



var tileSrcQueue = [];// src's
function getTile() {
  var img = new Image();
  img.src = 'data:empty';

  queueTileSrc(tileSrc, )
}