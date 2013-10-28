define([
  'aeris/util',
  'wire!spec/aeris/builder/maps/options/context'
], function(_, context) {
  // Load wired Options module
  var Options = context.MapAppBuilderOptions;

  describe('MapAppBuilderOptions', function() {

    describe('constructor', function() {

      it('should set default options', function() {
        var options;
        var cannedDefaults = { foo: 'bar' };
        spyOn(Options.prototype, 'getDefaultOptions').andReturn(cannedDefaults);

        options = new Options();
        expect(options.get('foo')).toEqual('bar');
      });

      it('should normalize MapObjectOptions', function() {
        var options = new Options({
          layers: ['LayerA', {
            name: 'LayerB'
          }, 'LayerC']
        });

        _.each(options.get('layers'), function(lyrOpt) {
          expect(lyrOpt.name).toBeDefined();
          expect(lyrOpt.default).toBeDefined();
          expect(lyrOpt.filters).toBeDefined();
        });
      });

      it('should not show map objects by default, if controls are enabled', function() {
        var options = new Options({
          layers: ['LayerA',
            {
              name: 'LayerB'
            },
            {
              name: 'LayerC',
              default: true
            }
          ],
          controls: {
            layers: true
          }
        });

        expect(options.get('layers')[0].default).toEqual(false);   // Layer A
        expect(options.get('layers')[1].default).toEqual(false);   // Layer B
        expect(options.get('layers')[2].default).toEqual(true);   // Layer C
      });

      it('should show map objects by default, if controls are disabled', function() {
        var options = new Options({
          layers: ['LayerA',
            {
              name: 'LayerB'
            },
            {
              name: 'LayerC',
              default: false
            }
          ],
          controls: {
            layers: false
          }
        });

        expect(options.get('layers')[0].default).toEqual(true);   // Layer A
        expect(options.get('layers')[1].default).toEqual(true);   // Layer B
        expect(options.get('layers')[2].default).toEqual(false);   // Layer C
      });

    });

  });

});
