define([
  'aeris/util',
  'aeris/maps/layers/abstracttile'
], function(_, AbstractTile) {


  var ConcreteTile = function(opt_attrs, opt_options) {
    var attrs = _.defaults(opt_attrs || {}, {
      name: 'STUB_NAME',
      server: 'STUB_SERVER'
    });
    var options = _.defaults(opt_options || {}, {
      strategy: function() {
      }
    });

    AbstractTile.call(this, attrs, options);
  };
  _.inherits(ConcreteTile, AbstractTile);

  ConcreteTile.prototype.getUrl = function() {
    return 'STUB_URL';
  };


  function testFactory() {
    var Tile = function() {
      var options = {
        strategy: function() {
        }
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


  describe('AbstractTile', function() {
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


    describe('preload', function() {
      var tile, onResolve, onReject, mockMap;

      beforeEach(function() {
        tile = new ConcreteTile();
        mockMap = { STUB: 'MAP' };
        onResolve = jasmine.createSpy('onResolve');
        onReject = jasmine.createSpy('onReject');
      });

      function loadTile(tile) {
        tile.trigger('load');
      };


      it('should resolve immediately if the layer is already loaded', function() {
        loadTile(tile);

        tile.preload(mockMap).
          done(onResolve).
          fail(_.throwError);

        expect(onResolve).toHaveBeenCalled();
      });

      it('should resolve once the layer has loaded', function() {
        tile.preload(mockMap).
          done(onResolve).
          fail(_.throwError);
        expect(onResolve).not.toHaveBeenCalled();

        loadTile(tile);

        expect(onResolve).toHaveBeenCalled();
      });

      it('should not change the layer\'s original attributes', function() {
        var attrs_orig = {
          opacity: 0.123,
          map: { STUB: 'MAP_ORIG' }
        };
        tile.set(_.clone(attrs_orig));

        tile.preload(mockMap);

        expect(tile.pick(['opacity', 'map'])).toEqual(attrs_orig);
      });

      it('should reject if no map is provided', function() {
        tile.preload().
          fail(onReject);

        expect(onReject).toHaveBeenCalled();
      });

      it('should set the layer to the provided map', function() {
        var onChangeMap = jasmine.createSpy('onChangeMap');
        tile.once('change:map', onChangeMap);

        onChangeMap.andCallFake(function() {
          expect(tile.get('map')).toEqual(mockMap);
        });

        tile.preload(mockMap);
        expect(onChangeMap).toHaveBeenCalled();
      });

    });

  });
});
