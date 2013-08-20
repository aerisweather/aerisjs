define([
  'aeris/util',
  './events/click',
  './events/aerisweatherdetailsclick',
  './events/aerissunmoondetailsclick'
],
function(_) {

  /**
   * @fileoverview Ensure abstract and common events are loaded.
   */


  _.provide('aeris.maps.events');


  return aeris.maps.events;

});
