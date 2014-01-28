define([
  'ai/util',
  'ai/maps/map'
], function(_, Map) {

  var MapFactory = function(opt_el, opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      strategy: null
    });

    var el = _.isUndefined(opt_el) ? 'EL_STUB' : opt_el;

    return new Map(el, opt_attrs, options);
  };
  
  describe('A Map', function() {

    describe('constructor', function() {

      it('should require an element', function() {
        expect(function() {
          new MapFactory(null);
        }).toThrowType('ValidationError');

        new MapFactory('map-canvas');
        new MapFactory(null, {
          el: 'map-canvas'
        });
      });

    });

  });
  
});
