define([
  'aeris/util',
  'base/layers/abstracttile'
], function(_, AbstractTile) {


  function testFactory() {
    var Tile = function() {
      var options = {
        strategy: function() {}
      };
      var attrs = {
        name: 'myName',
        server: 'someServer',
        subdomains: ['a', 'b', 'c']
      };

      AbstractTile.call(this, attrs, options);
    };
    _.inherits(Tile, AbstractTile);

    return {
      tile: new Tile()
    };
  }


  describe('An AbstractTile', function() {
    describe('constructor', function() {
      it('should require name and server', function() {
        var reqProps = ['name', 'server'];

        // Create several Tile classes,
        // each missing one required property version
        _.each(reqProps, function(missingProp) {
          expect(function() {
            var Tile = function() {
              var options = {
                strategy: function() {}
              };
              var attrs = {
                name: (missingProp === 'name') ? undefined : 'myName',
                server: (missingProp === 'server') ? undefined : 'someServer'
              };

              AbstractTile.call(this, attrs, options);
            };
            _.inherits(Tile, AbstractTile);
            new Tile();
          }).toThrowType('ValidationError');
        });

        // Check that we're fine with properties defined.
        testFactory();
      });
    });

    describe('getRandomSubdomain', function() {
      it('return a random subdomain', function() {
        var test = testFactory();
        var returnedSDs = [];

        _.times(100, function() {
          var sd = test.tile.getRandomSubdomain();
          returnedSDs.push(sd);
        });

        // Expect all subdomains to have been returned
        expect(_.difference(returnedSDs, test.tile.get('subdomains'))).toEqual([]);
      });
    });

    describe('zoomFactor (default implementation)', function() {
      it('returns the provided zoom factor', function() {
        var test = testFactory();
        var zoom = 7;
        expect(test.tile.zoomFactor(zoom)).toEqual(zoom);
      });
    });
  });
});
