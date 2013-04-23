define([
  'aeris',
  './layers/googleroadmap',
  './layers/googlesatellite',
  './layers/googleterrain',
  './layers/googlehybrid',
  './layers/osm',
  './layers/aerisradar'
], function(aeris) {

  /**
   * @fileoverview Ensure abstract and common layers are loaded.
   */


  aeris.provide('aeris.maps.layers');


  return aeris.maps.layers;

});
