define([
  'aeris/util',
  'base/layers/googleroadmap',
  'base/layers/googlesatellite',
  'base/layers/googleterrain',
  'base/layers/googlehybrid',
  'base/layers/osm',
  'base/layers/aerisradar',
  'base/layers/aerissatellite',
  'base/layers/aerissatellitevisible',
  'base/layers/aerissatelliteglobal',
  'base/layers/aerisadvisories',
  'base/layers/aeristemps',
  'base/layers/aeriswinds',
  'base/layers/aerisdewpoints',
  'base/layers/aerisheatindex',
  'base/layers/aerishumidity',
  'base/layers/aerissnowdepth',
  'base/layers/aeriswindchill',
  'base/layers/aerisadvisorieskml',
  'base/layers/aerisseasurfacetemps',
  'base/layers/aerischlorophyll',
  'base/layers/infobox',
  'base/layers/aerisconvectivehazards'
], function(_) {

  /**
   * @fileoverview Ensure abstract and common layers are loaded.
   */


  _.provide('aeris.maps.layers');


  return aeris.maps.layers;

});
