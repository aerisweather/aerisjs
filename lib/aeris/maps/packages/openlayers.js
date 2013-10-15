/**
 * @fileoverview Defines the gmaps packages. Includes the base maps library,
 * as well as all strategies for rendering google maps.
*/
require.config({
  map: {
    '*': {
      strategy: 'aeris/maps/openlayers'
    }
  }
});
define('packages/openlayers', [
  'packages/maps',
  'strategy/infoboxstrategy',
  'strategy/map',
  'strategy/markerstrategy',
  'strategy/layerstrategies/aerisinteractivetile',
  'strategy/layerstrategies/aerispolygons',
  'strategy/layerstrategies/googlemaptype',
  'strategy/layerstrategies/kml',
  'strategy/layerstrategies/osm',
  'strategy/layerstrategies/tile'
]);
