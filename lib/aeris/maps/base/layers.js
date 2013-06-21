define([
  'aeris',
  './layers/googleroadmap',
  './layers/googlesatellite',
  './layers/googleterrain',
  './layers/googlehybrid',
  './layers/osm',
  './layers/aerisradar',
  './layers/aerissatellite',
  './layers/aerissatellitevisible',
  './layers/aerissatelliteglobal',
  './layers/aeristemps',
  './layers/aeriswinds',
  './layers/aerisdewpoints',
  './layers/aerisheatindex',
  './layers/aerishumidity',
  './layers/aerissnowdepth',
  './layers/aeriswindchill',
  './layers/aerisadvisorieskml',
  './layers/aerismodistile',
  './layers/aerisseasurfacetemps',
  './layers/aerischlorophyll',
  './layers/infobox',
  './layers/aerisconvectivehazards'
], function(aeris) {

  /**
   * @fileoverview Ensure abstract and common layers are loaded.
   */


  aeris.provide('aeris.maps.layers');


  return aeris.maps.layers;

});
