define(['base/layers/aerisseasurfacetemps'], function(AerisSeaSurfaceTemps) {
  describe("An AerisSeaSurfaceTemps Layer", function() {

    it("should accept a modis period as a constructor parameter", function() {
      var layer = new AerisSeaSurfaceTemps(3);
      expect(layer.tileType).toBe("modis_sst_3day");
    });

    it("should default to a 1 day modis period", function() {
      var layer = new AerisSeaSurfaceTemps();
      expect(layer.tileType).toBe("modis_sst_1day");
    });

  });
});