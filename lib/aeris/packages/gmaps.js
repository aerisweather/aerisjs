/**
 * @fileoverview Defines the gmaps packages. Includes the base maps library,
 * as well as all strategies for rendering google maps.
*/
require([
  'ai/maps/strategy/infoboxstrategy',
  'ai/maps/strategy/map',
  'ai/maps/strategy/markerstrategies/markerstrategy',
  'ai/maps/strategy/markerstrategies/markerclusterstrategy',
  'ai/maps/strategy/layerstrategies/aerisinteractivetile',
  'ai/maps/strategy/layerstrategies/aerispolygons',
  'ai/maps/strategy/layerstrategies/googlemaptype',
  'ai/maps/strategy/layerstrategies/kml',
  'ai/maps/strategy/layerstrategies/osm',
  'ai/maps/strategy/layerstrategies/tile',
  'ai/maps/strategy/polylinestrategies/polylinestrategy'
]);
