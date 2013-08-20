define([
  'base/extension/mapextensionobject',
  'testErrors/untestedspecerror'
], function(MapExtensionObject, UntestedSpecError) {
  describe('A MapExtensionObject', function() {

    it('should provide a unique \'id\'  property', function() {
      var ext1 = new MapExtensionObject();
      var ext2 = new MapExtensionObject();

      expect(ext1.id).toBeDefined();
      expect(ext2.id).not.toEqual(ext1.id);
    });

  });
});
