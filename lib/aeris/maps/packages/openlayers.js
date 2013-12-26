/**
 * @fileoverview Defines the openlayers build package. Includes the base maps library,
 * as well as all strategies for rendering open layers maps.
*/
require.config({
  map: {
    '*': {
      strategy: 'aeris/maps/openlayers'
    }
  }
});
require([
  'packages/maps',
  'strategy/infoboxstrategy',
  'strategy/map',
  'strategy/markerstrategies/markerstrategy',
  'strategy/layerstrategies/aerisinteractivetile',
  'strategy/layerstrategies/aerispolygons',
  'strategy/layerstrategies/googlemaptype',
  'strategy/layerstrategies/kml',
  'strategy/layerstrategies/osm',
  'strategy/layerstrategies/tile'
]);
