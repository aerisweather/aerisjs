define([
  'base/layers/aerismodistile'
], function(AerisModisTile) {
  /**
   * @fileoverview Tests specs for aeris.maps.layers.AerisModisTile
   */
  describe("An AerisModisTile layer", function() {

    var modisPeriodTileTypes = {
      1: "code_1day",
      3: "code_3day",
      7: "code_7day"
    };

    it("should dynamically create tileType from modis period", function() {
      var layer = new AerisModisTile();
      layer.modisPeriodTileTypes = modisPeriodTileTypes;

      layer.setModisPeriod(1);
      expect(layer.tileType).toBe("code_1day");
      layer.setModisPeriod(3);
      expect(layer.tileType).toBe("code_3day");
      layer.setModisPeriod(7);
      expect(layer.tileType).toBe("code_7day");
      layer.setModisPeriod("1");
      expect(layer.tileType).toBe("code_1day");
    });

    it("should reject invalid modis periods", function() {
      var layer = new AerisModisTile();
      layer.modisPeriodTileTypes = modisPeriodTileTypes;

      var negativeFn = function() { layer.setModisPeriod(-1); }
      var nonIntegerFn = function() { layer.setModisPeriod("foobar"); }
      var notAvailableFn = function() { layer.setModisPeriod(2); }

      expect(negativeFn).toThrow();
      expect(nonIntegerFn).toThrow();
      expect(notAvailableFn).toThrow();
    });
  });
});