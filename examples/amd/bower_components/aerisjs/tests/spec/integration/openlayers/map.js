define([
  'aeris/util',
  'openlayers',
  'aeris/maps/map',
  'tests/spec/integration/helpers/mapcanvas'
], function(_, OpenLayers, AerisMap, MapCanvas) {

  describe('Maps with OpenLayers', function() {
    var aerisMap, openLayersMap;
    var mapCanvas;

    beforeEach(function() {
      mapCanvas = new MapCanvas();
    });
    afterEach(function() {
      mapCanvas.remove();
    });


    beforeEach(function() {
      aerisMap = new AerisMap(mapCanvas);
      openLayersMap = aerisMap.getView();
    });


    describe('creating a map', function() {

      it('should create an OpenLayers.Map object', function() {
        expect(openLayersMap).toBeInstanceOf(OpenLayers.Map);
      });

      it('should use a predefined OpenLayers map view', function() {
        var mapCanvas = new MapCanvas();
        var openLayersMap = new OpenLayers.Map(mapCanvas);
        var aerisMap = new AerisMap(openLayersMap);

        expect(aerisMap.getView()).toEqual(openLayersMap);
      });


    });



  });

});
