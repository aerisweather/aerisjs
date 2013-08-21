/**
 * @fileoverview Functional tests for the Aeris RouteAppBuilder component.
*/
define([
  'sinon',
  'aeris/builder/route/routeappbuilder',
  'vendor/jquery',
  'googlemaps'
], function(sinon, RouteAppBuilder, $, googlemaps) {
  describe('A RouteAppBuilder', function() {
    var $appDiv = $('<div></div>');
    beforeEach(function() {
      $appDiv.appendTo('body');
    });

    afterEach(function() {
      $appDiv.empty().remove();
    });

    it('should create a google map', function() {
      var appOptions = {
        div: $appDiv[0],
        map: {
          zoom: 14
        }
      };
      var builder;
      var stubbedMap = jasmine.createSpyObj('map', ['setMapTypeId', 'setZoom', 'setCenter']);
      var mapDiv;

      spyOn(google.maps, 'Map').andCallFake(function(div) {
        expect(div.className).toEqual('aeris-map-canvas');
        mapDiv = div;
        return stubbedMap;
      });

      builder = new RouteAppBuilder(appOptions);
      builder.build();

      expect(google.maps.Map).toHaveBeenCalled();
      expect(stubbedMap.setMapTypeId).toHaveBeenCalledWith(google.maps.MapTypeId.ROADMAP);
      expect(stubbedMap.setZoom).toHaveBeenCalledWith(appOptions.map.zoom);
      expect($appDiv.find(mapDiv).length).toEqual(1);
    });
  });
});

