define(['aeris/utils'], function(utils) {
  describe('The Aeris Utility Library', function() {
    it('should provide unique ids', function() {
      var uuids = [];

      for (var i = 0; i < 50; i++) {
        var id = utils.uniqueId();
        expect(uuids.indexOf(id)).toEqual(-1);

        uuids.push(id);
      }

      for (var i = 0; i < 50; i++) {
        var id = utils.uniqueId('somePrefix');
        expect(uuids.indexOf(id)).toEqual(-1);

        uuids.push(id);
      }
    });
  });
});
