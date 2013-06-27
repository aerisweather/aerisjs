define([
  'aeris',
  './events/click',
  './events/aerisweatherdetailsclick',
  './events/aerissunmoondetailsclick'
],
function(aeris) {

  /**
   * @fileoverview Ensure abstract and common events are loaded.
   */


  aeris.provide('aeris.maps.events');


  return aeris.maps.events;

});
