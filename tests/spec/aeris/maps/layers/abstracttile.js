define([
  'aeris/util',
  'aeris/maps/layers/abstracttile'
], function(_, AbstractTile) {


  var ConcreteTile = function(opt_attrs, opt_options) {
    var attrs = _.defaults(opt_attrs || {}, {
      name: 'STUB_NAME',
      server: 'STUB_SERVER'
    });

    AbstractTile.call(this, attrs, opt_options);
  };
  _.inherits(ConcreteTile, AbstractTile);

  ConcreteTile.prototype.getUrl = function() {
    return 'STUB_URL';
  };


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

      it('should require a name', function() {
        expect(function() {
          new ConcreteTile({
            name: null
          });
        }).toThrowType('ValidationError');

        new ConcreteTile({
          name: 'STUB_NAME'
        });
      });

      it('should require server', function() {
        expect(function() {
          new ConcreteTile({
            server: null
          });
        }).toThrowType('ValidationError');

        new ConcreteTile({
          server: 'STUB_NAME'
        });
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
