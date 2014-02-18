define(['aeris/maps/layers/seasurfacetemps'], function(SeaSurfaceTemps) {
  describe('An SeaSurfaceTemps Layer', function() {

    it('should accept a modis period as a constructor parameter', function() {
      var layer = new SeaSurfaceTemps(null, { period: 3 });
      expect(layer.get('tileType')).toBe('modis_sst_3day');
    });

    it('should default to a 14 day modis period', function() {
      var layer = new SeaSurfaceTemps();
      expect(layer.get('tileType')).toBe('modis_sst_14day');
    });

  });
});
