define([
  'aeris/util',
  './layers/googleroadmap',
  './layers/googlesatellite',
  './layers/googleterrain',
  './layers/googlehybrid',
  './layers/osm',
  './layers/aerisradar',
  './layers/aerissatellite',
  './layers/aerissatellitevisible',
  './layers/aerissatelliteglobal',
  './layers/aerisadvisories',
  './layers/aeristemps',
  './layers/aeriswinds',
  './layers/aerisdewpoints',
  './layers/aerisheatindex',
  './layers/aerishumidity',
  './layers/aerissnowdepth',
  './layers/aeriswindchill',
  './layers/aerisadvisorieskml',
  './layers/aerisseasurfacetemps',
  './layers/aerischlorophyll',
  './layers/infobox',
  './layers/aerisconvectivehazards'
], function(_) {

  /**
   * @fileoverview Ensure abstract and common layers are loaded.
   */


  _.provide('aeris.maps.layers');


  return aeris.maps.layers;

});
